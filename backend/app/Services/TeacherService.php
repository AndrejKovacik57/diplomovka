<?php

namespace App\Services;

use App\Models\Course;
use App\Models\CourseExercise;
use App\Models\Exercise;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;


class TeacherService
{
    public function addExerciseToCourse(string $courseId, string $exerciseId): array
    {
        $course = Course::query()->findOrFail($courseId);
        $exercise = Exercise::query()->findOrFail($exerciseId);

        if ($course->exercises->contains($exerciseId)) {
            abort(ResponseAlias::HTTP_FORBIDDEN, 'Exercise already in course');
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

    public function updateCourseExerciseDates(array $validated): void
    {
        $courseExercise = CourseExercise::query()->findOrFail($validated['id']);
        $courseExercise->fill([
            'start' => $validated['start'],
            'end' => $validated['end'],
        ]);

        if (!$courseExercise->isDirty()) {
            abort(ResponseAlias::HTTP_NOT_MODIFIED, 'No changes detected');

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
                        'message' => $r->message,
                    ]),
                ];
            }

            $result[] = $exerciseData;
        }

        return $result;
    }
}
