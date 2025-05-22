<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\StudentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class StudentController extends Controller
{

    protected StudentService $studentService;

    public function __construct(StudentService $studentService)
    {
        $this->studentService = $studentService;
    }


    public function getUsersCourseExercises(): JsonResponse
    {
        try {
            /** @var User $user */
            $user = Auth::user();

            $courses = $this->studentService->getUserCoursesWithExercises($user);

            return response()->json(['courses' => $courses], ResponseAlias::HTTP_CREATED);

        }
        catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], $e->getCode() ?: 500);
        }
     }

    public function getUserExercise(Request $request, $courseId, $exerciseId): JsonResponse
    {
        try {
            /** @var User $user */
            $user = auth()->user();
            $exercise = $this->studentService->getUserExercise($user, (int)$courseId, (int)$exerciseId);

            return response()->json($exercise, ResponseAlias::HTTP_OK);
        }
        catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], $e->getCode() ?: 500);
        }
    }

    public function getUserSolutions(Request $request): JsonResponse
    {
        try {
            /** @var User $user */
            $user = Auth::user();

            $solutions = $this->studentService->getUserSolutions($user);

            return response()->json($solutions, ResponseAlias::HTTP_OK);
        }
        catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], $e->getCode() ?: 500);
        }
    }

}
