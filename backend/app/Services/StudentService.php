<?php

namespace App\Services;

use App\Models\Course;
use App\Models\User;
use Carbon\Carbon;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class StudentService
{
    protected ExerciseService $exerciseService;

    public function __construct(ExerciseService $exerciseService)
    {
        $this->exerciseService = $exerciseService;
    }

    public function getUserCoursesWithExercises(User $user): array
    {
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

        return $result;
    }

    public function getUserExercise(User $user, int $courseId, int $exerciseId): array
    {
        if (!$user->courses()->where('courses.id', $courseId)->exists()) {
            abort(ResponseAlias::HTTP_FORBIDDEN, 'User not enrolled in course');
        }

        $course = Course::with(['exercises' => fn ($q) => $q->where('exercises.id', $exerciseId)])
            ->find($courseId);

        if (!$course) {
            abort(ResponseAlias::HTTP_NOT_FOUND, 'Course does not exist');
        }
        $exercise = $course->exercises->firstWhere('id', $exerciseId);
        if (!$exercise) {
            abort(ResponseAlias::HTTP_NOT_FOUND, 'Exercise does not exist');
        }

        $now = Carbon::now();
        $start = $exercise->pivot->start;
        $end = $exercise->pivot->end;

        if (($start && $now->lt($start)) || ($end && $now->gt($end))) {
            abort(ResponseAlias::HTTP_FORBIDDEN, 'Exercise is not currently available');
        }

        return $this->exerciseService->getExerciseWithFiles($exerciseId);
    }

    public function getUserSolutions(User $user): array
    {
        $courses = $user->courses()->with(['exercises'])->get();
        $response = [];

        foreach ($courses as $course) {
            $courseData = [
                'id' => $course->id,
                'name' => $course->name,
                'exercises' => [],
            ];

            foreach ($course->exercises as $exercise) {
                $courseExercise = $course->courseExercises()->where('exercise_id', $exercise->id)->first();
                if (!$courseExercise) continue;

                $solutions = $courseExercise->solutions()
                    ->where('user_id', $user->id)
                    ->with('testResults')
                    ->get();

                if ($solutions->isEmpty()) continue;

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
                        'test_results' => $solution->testResults->map(fn ($r) => [
                            'id' => $r->id,
                            'test_name' => $r->test_name,
                            'status' => $r->status,
                            'message' => $r->message,
                        ]),
                    ];
                }

                $courseData['exercises'][] = $exerciseData;
            }

            if (!empty($courseData['exercises'])) {
                $response[] = $courseData;
            }
        }

        return $response;
    }
}
