<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\AuthControllerThirdParty;
use App\Http\Controllers\ExerciseController;
use App\Http\Controllers\SolutionController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\CourseController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;



// Protected Routes (Only authenticated users can access)
Route::middleware('auth:sanctum')->group(function () {
    // API Resources (Restricted to authenticated users)
    Route::apiResource('solution', SolutionController::class);
    Route::get('user/courses/exercises', [StudentController::class, 'getUsersCourseExercises']);
    Route::get('user/course/{courseId}/exercise/{exerciseId}', [StudentController::class, 'getUserExercise']);
    Route::get('user/courses/exercises/solutions', [StudentController::class, 'getUserSolutions']);

    Route::post('aislog', [AuthControllerThirdParty::class, 'AISLogin']);

    // Logout Route (Authenticated users only)
    Route::post('logout', [AuthController::class, 'logout']);

    // Get Authenticated User Info
    Route::get('user', function (Request $request) {
        return $request->user();
    });
});

// Teacher-only routes
Route::middleware(['auth:sanctum', 'teacher'])->group(function () {
    Route::apiResource('course', CourseController::class);
    Route::apiResource('exercise', ExerciseController::class);
    Route::post('course/{course}/exercise/{exercise}', [CourseController::class, 'addExercise']);
    Route::post('course/exercise/updateDates', [CourseController::class, 'updateDatesCourseExercise']);
    Route::get('user/getExercises', [\App\Http\Controllers\UserController::class, 'userExercises']);
});

// Public Routes (Auth-related)
Route::post('signup', [AuthController::class, 'signUp']);
Route::post('login', [AuthController::class, 'login']);

Route::get('auth', [AuthControllerThirdParty::class, 'redirectToAuthGoogle']);
Route::get('auth/callback', [AuthControllerThirdParty::class, 'handleAuthCallback']);
