<?php

namespace App\Http\Controllers;

use App\Services\TeacherService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class TeacherController extends Controller
{
    protected TeacherService $teacherService;

    public function __construct(TeacherService $teacherService)
    {
        $this->teacherService = $teacherService;
    }

    public function addExercise(string $courseId, string $exerciseId): JsonResponse
    {
        try {
            $exercise = $this->teacherService->addExerciseToCourse($courseId, $exerciseId);
            return response()->json(['exercise' => $exercise], ResponseAlias::HTTP_OK);
        }
        catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], $e->getCode() ?: 500);
        }
    }

    public function updateDatesCourseExercise(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'id' => 'required|integer',
                'start' => 'nullable|date',
                'end' => 'nullable|date|after_or_equal:start',
            ]);

            $this->teacherService->updateCourseExerciseDates($validated);
            return response()->json(['message' => 'Dates updated successfully.']);
        }
        catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], $e->getCode() ?: 500);
        }
    }

    public function getUserSolutions(string $courseId, string $userId): JsonResponse
    {
        try {
            $exercises = $this->teacherService->getUserSolutions($courseId, $userId);
            if (empty($exercises)) {
                return response()->json(null, 204);
            }
            return response()->json($exercises);
        }
        catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], $e->getCode() ?: 500);
        }
    }
}
