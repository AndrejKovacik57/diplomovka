<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\CourseExercise;
use App\Models\Exercise;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class TeacherController extends Controller
{

    public function addExercise(string $courseId, string $exerciseId): \Illuminate\Http\JsonResponse
    {
        $course = Course::query()->findOrFail($courseId);
        $exercise = Exercise::query()->findOrFail($exerciseId);
        // Check if the exercise is already attached
        if ($course->exercises->contains($exerciseId)) {
            return response()->json(['message' => 'Exercise is already added to the course.'], 409);
        }
        // Attach without detaching existing ones
        $course->exercises()->syncWithoutDetaching($exercise->id);

        $attachedExercise = $course->exercises()->where('exercise_id', $exerciseId)->first();

        $response = [
            'id' => $attachedExercise->pivot->id,
            'title' => $attachedExercise->title,
            'description' => $attachedExercise->description,
            'start_datetime' => $attachedExercise->pivot->start,
            'end_datetime' => $attachedExercise->pivot->end,
        ];

        return response()->json(['message' => 'Exercise added to course successfully!', 'exercise'=>$response], 200);
    }

    public function updateDatesCourseExercise(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'id' => 'required|integer',
                'start' => 'nullable|date',
                'end' => 'nullable|date|after_or_equal:start',
            ]);

            DB::beginTransaction();

            $courseExercise = CourseExercise::query()->findOrFail($validated['id']);

            if (!$courseExercise) {
                DB::rollBack();
                return response()->json(['message' => 'Course exercise not found.'], 404);
            }

            $courseExercise->start = $validated['start'];
            $courseExercise->end = $validated['end'];

            if (!$courseExercise->isDirty()) {
                DB::rollBack();
                return response()->json(['message' => 'No changes detected.'], 400);
            }

            $courseExercise->save();

            DB::commit();
            return response()->json(['message' => 'Dates updated successfully.']);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'An error occurred.', 'error' => $e->getMessage()], 500);
        }
    }

    public function getUserSolutions(string $courseId, string $userId): JsonResponse
    {
        $course = Course::with('exercises')->find($courseId);
        Log::info('test1');
        Log::info('$courseId '.$courseId.' $userId '.$userId);

        if (!$course) {
            return response()->json(['message' => 'Course not found.'], 404);
        }
        $exercises = [];
        Log::info('Exercises count: ' . $course->exercises->count());
        Log::info($course->exercises);


        Log::info('test2');
        foreach ($course->exercises as $exercise) {

            Log::info('test3');
            // Get the CourseExercise instance
            $courseExercise = $course->courseExercises()
                ->where('exercise_id', $exercise->id)
                ->first();

            if (!$courseExercise) {
                continue;
            }

            // Get the user's solutions from CourseExercise
            $solutions = $courseExercise->solutions()
                ->where('user_id', $userId)
                ->with('testResults')
                ->get();

            if ($solutions->isEmpty()) {
                continue;
            }

            Log::info('test4');

            $exerciseData = [
                'id' => $exercise->id,
                'title' => $exercise->title,
                'description' => $exercise->description,
                'solutions' => [],
            ];

            foreach ($solutions as $solution) {
                $exerciseData['solutions'][] = [
                    'id' => $solution->id,
                    'file_name' => $solution->file_name,
                    'file_data' => base64_encode(Storage::get($solution->file_path)), // Convert file to Base64
                    'test_status' => $solution->test_status,
                    'test_output' => $solution->test_output,
                    'submitted_at' => $solution->submitted_at,
                    'test_results' => $solution->testResults->map(function ($result) {
                        return [
                            'id' => $result->id,
                            'test_name' => $result->test_name,
                            'status' => $result->status,
                            'message' => $result->message,
                        ];
                    }),
                ];
            }

            Log::info('test5');
            Log::info($exerciseData['solutions']);

            $exercises[] = $exerciseData;
        }

        // Only add the course if it has at least one exercise with solutions
        if (empty($exercises)) {
            Log::info('test6');
            return response()->json(null, 204);
        }


        Log::info('test8');
        return response()->json($exercises);
    }
}
