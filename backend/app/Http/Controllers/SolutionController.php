<?php

namespace App\Http\Controllers;

use App\Http\Requests\SolutionRequest;
use App\Jobs\RunSolutionTests;
use App\Models\CourseExercise;
use App\Models\Solutions;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class SolutionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        \assert($user instanceof User);

        $solutions = $user->solutions()->with('courseExercise.course', 'courseExercise.exercise')->get();

        return response()->json($solutions);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(SolutionRequest $request): JsonResponse
    {

        $fields = $request->validated();
        $courseId = $fields['courseId'];
        $exerciseId = $fields['exerciseId'];
        $userId = Auth::id();

        // Find the CourseExercise row for the course + exercise pair
        $courseExercise = CourseExercise::query()
            ->where('course_id', $courseId)
            ->where('exercise_id', $exerciseId)
            ->firstOrFail();

        DB::beginTransaction();
        try {
            $oldSolution = Solutions::query()
                ->where('user_id', $userId)
                ->where('course_exercise_id', $courseExercise->id)
                ->first();

            if ($oldSolution) {
                Storage::disk('local')->delete($oldSolution->file_path);
                $oldSolution->delete();
            }
            Solutions::query()
                ->where('user_id', $userId)
                ->where('course_exercise_id', $courseExercise->id)
                ->delete();

            // Process the uploaded file
            $file = $fields['codeFile'];
            $name = $file->getClientOriginalName();
            $extension = $file->getClientOriginalExtension();
            $filePath = $file->store('solutions', 'local');
            $noExtensionFilePath = preg_replace('/\.[^.]+$/', '', $filePath);
            $finalPath = $noExtensionFilePath . '.' . $extension;

            Storage::disk('local')->move($filePath, $finalPath);

            $solution = Solutions::query()->create([
                'course_exercise_id' => $courseExercise->id,
                'file_path' => $finalPath,
                'file_name' => $name,
                'user_id' => $userId,
            ]);
            dispatch(new RunSolutionTests($solution));


            DB::commit();
            return response()->json(['solution' => $solution], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to create exercise'. $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Solutions $solution)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(SolutionRequest $request, Solutions $solution)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Solutions $solution)
    {
        //
    }
}
