<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\User;
use App\Services\ExerciseService;
use App\Services\StudentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
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
        /** @var User $user */
        $user = Auth::user();

        $courses = $this->studentService->getUserCoursesWithExercises($user);

        return response()->json(['courses' => $courses], ResponseAlias::HTTP_CREATED);
    }

    public function getUserExercise(Request $request, $courseId, $exerciseId): JsonResponse
    {
        /** @var User $user */
        $user = auth()->user();
        $exercise = $this->studentService->getUserExercise($user, (int)$courseId, (int)$exerciseId);

        return response()->json($exercise, ResponseAlias::HTTP_OK);
    }

    public function getUserSolutions(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();

        $solutions = $this->studentService->getUserSolutions($user);

        return response()->json($solutions, ResponseAlias::HTTP_OK);
    }

}
