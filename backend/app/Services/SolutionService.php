<?php

namespace App\Services;

use App\Jobs\RunSolutionTests;
use App\Models\CourseExercise;
use App\Models\Solution;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class SolutionService
{
    /**
     * @throws Exception
     */
    public function storeSolution(array $fields): Solution
    {
        $userId = Auth::id();

        $courseExercise = CourseExercise::query()
            ->where('course_id', $fields['courseId'])
            ->where('exercise_id', $fields['exerciseId'])
            ->firstOrFail();

        if ($courseExercise->public) {
            throw new Exception('Cannot test public exercise', ResponseAlias::HTTP_FORBIDDEN);
        }

        return DB::transaction(function () use ($courseExercise, $userId, $fields) {

            Solution::query()
                ->where('user_id', $userId)
                ->where('course_exercise_id', $courseExercise->id)
                ->where('is_active', true)
                ->update(['is_active' => false]);


            $oldSolutions = Solution::query()
                ->where('user_id', $userId)
                ->where('is_active', false)
                ->where(function ($query) {
                    $query->whereIn('test_status', [Solution::STATUS_FINISHED, Solution::STATUS_FAILED])
                        ->orWhere('created_at', '<', Carbon::now()->subMinute());
                })
                ->get();

            foreach ($oldSolutions as $old) {
                Storage::disk('local')->delete($old->file_path);
                $old->delete();
            }


            $file = $fields['codeFile'];
            $originalName = $file->getClientOriginalName();
            $extension = $file->getClientOriginalExtension();
            $storedPath = $file->store('solutions', 'local');
            $finalPath = preg_replace('/\.[^.]+$/', '', $storedPath) . '.' . $extension;

            Storage::disk('local')->move($storedPath, $finalPath);

            $solution = Solution::query()->create([
                'course_exercise_id' => $courseExercise->id,
                'user_id' => $userId,
                'file_path' => $finalPath,
                'file_name' => $originalName,
                'test_status' => Solution::STATUS_PENDING,
            ]);

            dispatch(new RunSolutionTests($solution));

            return $solution;
        });
    }
}
