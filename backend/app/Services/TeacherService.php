<?php

namespace App\Services;

use App\Models\Course;
use App\Models\CourseExercise;
use App\Models\Exercise;
use Exception;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;


class TeacherService
{
    /**
     * @throws Exception
     */
    public function addExerciseToCourse(string $courseId, string $exerciseId): array
    {
        $course = Course::query()->findOrFail($courseId);
        $exercise = Exercise::query()->findOrFail($exerciseId);

        if ($course->exercises->contains($exerciseId)) {
            throw new Exception('Exercise already in course', ResponseAlias::HTTP_FORBIDDEN);
        }

        $course->exercises()->syncWithoutDetaching($exercise->id);
        $attached = $course->exercises()->where('exercise_id', $exerciseId)->first();

        return [
            'id' => $attached->pivot->id,
            'title' => $attached->title,
            'description' => $attached->description,
            'start_datetime' => $attached->pivot->start,
            'end_datetime' => $attached->pivot->end,
        ];
    }

    /**
     * @throws Exception
     */
    public function updateCourseExerciseDates(array $validated): void
    {
        $courseExercise = CourseExercise::query()->findOrFail($validated['id']);
        $courseExercise->fill([
            'start' => $validated['start'],
            'end' => $validated['end'],
        ]);

        if (!$courseExercise->isDirty()) {
            throw new Exception('No changes detected', ResponseAlias::HTTP_NOT_MODIFIED);

        }

        $courseExercise->save();
    }

    public function getUserSolutions(string $courseId, string $userId): array
    {
        $course = Course::with('exercises')->findOrFail($courseId);
        $result = [];

        foreach ($course->exercises as $exercise) {
            $courseExercise = $course->courseExercises()->where('exercise_id', $exercise->id)->first();

            if (!$courseExercise) {
                continue;
            }

            $solutions = $courseExercise->solutions()
                ->where('user_id', $userId)
                ->active()
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
                    'file_data' => base64_encode(Storage::get($solution->file_path)),
                    'test_status' => $solution->test_status,
                    'test_output' => $solution->test_output,
                    'submitted_at' => $solution->submitted_at,
                    'test_results' => $solution->testResults->map(fn ($r) => [
                        'id' => $r->id,
                        'test_name' => $r->test_name,
                        'status' => $r->status,
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

            $result[] = $exerciseData;
        }

        return $result;
    }
    public function generateExerciseSolutionsCsv(string $courseExerciseId): array
    {
        $courseExercise = CourseExercise::query()->findOrFail($courseExerciseId);

        $solutions = $courseExercise->solutions()
            ->with(['user', 'testResults'])
            ->get();

        $csvData = [];

        // Header row
        $csvData[] = [
            'User ID', 'First Name', 'Last Name', 'Solution ID',
            'File Name', 'Test Status', 'Submitted At', 'Test Output',
            'Test Name', 'Test Result', 'Test Message'
        ];

        foreach ($solutions as $solution) {
            if ($solution->testResults->isEmpty()) {
                $csvData[] = [
                    $solution->user->id,
                    $solution->user->first_name,
                    $solution->user->last_name,
                    $solution->id,
                    $solution->file_name,
                    $solution->test_status,
                    $solution->created_at,
                    $solution->test_output,
                    '', '', '',
                ];
            } else {
                foreach ($solution->testResults as $testResult) {
                    $csvData[] = [
                        $solution->user->id,
                        $solution->user->first_name,
                        $solution->user->last_name,
                        $solution->id,
                        $solution->file_name,
                        $solution->test_status,
                        $solution->created_at,
                        $solution->test_output,
                        $testResult->test_name,
                        $testResult->status,
                        $testResult->message,
                    ];
                }
            }
        }

        return $csvData;
    }

}
