<?php

namespace App\Services;

use App\Models\Course;
use App\Models\User;
use Carbon\Carbon;
use Exception;
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

    /**
     * @throws Exception
     */
    public function getUserExercise(User $user, int $courseId, int $exerciseId): array
    {
        if (!$user->courses()->where('courses.id', $courseId)->exists()) {
            throw new Exception('User not enrolled in course', ResponseAlias::HTTP_FORBIDDEN);
        }

        $course = Course::with(['exercises' => fn ($q) => $q->where('exercises.id', $exerciseId)])
            ->find($courseId);

        if (!$course) {
            throw new Exception('Course does not exist', ResponseAlias::HTTP_NOT_FOUND);
        }
        $exercise = $course->exercises->firstWhere('id', $exerciseId);
        if (!$exercise) {
            throw new Exception('Exercise does not exist', ResponseAlias::HTTP_NOT_FOUND);
        }

        $now = Carbon::now();
        $start = $exercise->pivot->start;
        $end = $exercise->pivot->end;

        if (($start && $now->lt($start)) || ($end && $now->gt($end))) {
            throw new Exception('Exercise is not currently available', ResponseAlias::HTTP_FORBIDDEN);
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
                    ->active()
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
                            'outputs' => $r->outputs->map(fn ($o) => [
                                'id' => $o->id,
                                'input' => $o->input,
                                'expected_output' => $o->expected_output,
                                'actual_output' => $o->actual_output,
                                'subtest_status' => $o->subtest_status,
                            ]),
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
