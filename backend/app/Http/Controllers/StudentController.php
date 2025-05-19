<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Exercise;
use App\Models\User;
use App\Services\ExerciseAccessService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class StudentController extends Controller
{
    public function getUsersCourseExercises(): JsonResponse
    {
        $user = Auth::user();
        \assert($user instanceof User);

        $courses = $user->courses()->with('courseExercises.exercise')->get();
        $result = [];

        foreach ($courses as $course) {
            $courseData = $course->toArray();
            $courseData['exercises'] = [];

            foreach ($course->courseExercises as $courseExercise) {
                $exercise = $courseExercise->exercise;
                $exerciseData = $exercise->toArray();

                $exerciseData['pivot'] = [
                    'start' => $courseExercise->start,
                    'end' => $courseExercise->end,
                ];

                $courseData['exercises'][] = $exerciseData;
            }

            $result[] = $courseData;
        }

        return response()->json(['courses' => $result]);
    }

    public function getUserExercise(Request $request, $courseId, $exerciseId): JsonResponse
    {
        $user = auth()->user();
        \assert($user instanceof User);

        // Check if user is in the course
        $isUserInCourse = $user->courses()->where('courses.id', $courseId)->exists();
        if (!$isUserInCourse) {
            return response()->json(['message' => 'User not enrolled in course'], 403);
        }

        // Check if the course has the exercise
        $course = Course::with(['exercises' => function ($query) use ($exerciseId) {
            $query->where('exercises.id', $exerciseId);
        }])->find($courseId);

        if (!$course) {
            return response()->json(['message' => 'Course does not exist'], 404);
        }

        $exercise = $course->exercises->firstWhere('id', $exerciseId);

        if (!$exercise) {
            return response()->json(['message' => 'Exercise does not exist'], 404);
        }

        // Check if exercise is within start and end window
        $now = Carbon::now();
        $start = $exercise->pivot->start;
        $end = $exercise->pivot->end;

        // Check time window
        if (($start && $now->lt($start)) || ($end && $now->gt($end))) {
            return response()->json(['message' => 'Exercise is not currently available'], 403);
        }


        $service = new ExerciseAccessService();
        $result = $service->getExerciseWithFiles($exerciseId);
        return response()->json($result);
    }

    public function getUserSolutions(Request $request): JsonResponse
    {
        $user = Auth::user();
        \assert($user instanceof \App\Models\User);

        $courses = $user->courses()->with(['exercises'])->get();

        $response = [];

        foreach ($courses as $course) {
            $courseData = [
                'id' => $course->id,
                'name' => $course->name,
                'exercises' => [],
            ];

            foreach ($course->exercises as $exercise) {
                // Get the CourseExercise instance
                $courseExercise = $course->courseExercises()
                    ->where('exercise_id', $exercise->id)
                    ->first();

                if (!$courseExercise) {
                    continue;
                }

                // Get the user's solutions from CourseExercise
                $solutions = $courseExercise->solutions()
                    ->where('user_id', $user->id)
                    ->with('testResults')
                    ->get();

                if ($solutions->isEmpty()) {
                    continue;
                }

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

                $courseData['exercises'][] = $exerciseData;
            }

            // Only add the course if it has at least one exercise with solutions
            if (!empty($courseData['exercises'])) {
                $response[] = $courseData;
            }
        }


        return response()->json($response);
    }

}
