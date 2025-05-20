<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\CourseExercise;
use App\Models\Exercise;
use App\Services\TeacherService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class TeacherController extends Controller
{
    protected TeacherService $teacherService;

    public function __construct(TeacherService $teacherService)
    {
        $this->teacherService = $teacherService;
    }

    public function addExercise(string $courseId, string $exerciseId): \Illuminate\Http\JsonResponse
    {
        try {
            $exercise = $this->teacherService->addExerciseToCourse($courseId, $exerciseId);
            return response()->json(['exercise' => $exercise], ResponseAlias::HTTP_OK);
        } catch (\RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 409);
        }}

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
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        } catch (\Exception $e) {
            return response()->json(['message' => 'An error occurred.', 'error' => $e->getMessage()], 500);
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
        } catch (\Exception $e) {
            Log::error('Failed to retrieve user solutions: ' . $e->getMessage());
            return response()->json(['message' => 'Error fetching solutions', 'error' => $e->getMessage()], 500);
        }
    }
}
