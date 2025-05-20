<?php

namespace App\Services;

use App\Http\Requests\SolutionRequest;
use App\Jobs\RunSolutionTests;
use App\Models\CourseExercise;
use App\Models\Solution;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class SolutionService
{
    public function storeSolution(array $fields): Solution
    {
        $userId = Auth::id();

        $courseExercise = CourseExercise::query()
            ->where('course_id', $fields['courseId'])
            ->where('exercise_id', $fields['exerciseId'])
            ->firstOrFail();

        if ($courseExercise->public) {
            abort(ResponseAlias::HTTP_FORBIDDEN, 'Cannot test public exercise');
        }

        return DB::transaction(function () use ($courseExercise, $userId, $fields) {
            $existingSolution = Solution::query()->where('user_id', $userId)
                ->where('course_exercise_id', $courseExercise->id)
                ->first();

            if ($existingSolution) {
                Storage::disk('local')->delete($existingSolution->file_path);
                $existingSolution->delete();
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
