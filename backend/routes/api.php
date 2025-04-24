<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\AuthControllerThirdParty;
use App\Http\Controllers\ExerciseController;
use App\Http\Controllers\SolutionController;
use App\Http\Controllers\TestsController;
use App\Http\Controllers\CourseController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;



// Protected Routes (Only authenticated users can access)
Route::middleware('auth:sanctum')->group(function () {
    // API Resources (Restricted to authenticated users)
    Route::apiResource('exercise', ExerciseController::class);
    Route::apiResource('test', TestsController::class);
    Route::apiResource('solution', SolutionController::class);
    Route::apiResource('course', CourseController::class);
    Route::post('course/{course}/exercise/{exercise}', [CourseController::class, 'addExercise']);


    Route::post('aislog', [AuthControllerThirdParty::class, 'AISLogin']);

    // Logout Route (Authenticated users only)
    Route::post('logout', [AuthController::class, 'logout']);

    // Get Authenticated User Info
    Route::get('user', function (Request $request) {
        return $request->user();
    });
});

// Public Routes (Auth-related)
Route::post('signup', [AuthController::class, 'signUp']);
Route::post('login', [AuthController::class, 'login']);

Route::get('auth', [AuthControllerThirdParty::class, 'redirectToAuthGoogle']);
Route::get('auth/callback', [AuthControllerThirdParty::class, 'handleAuthCallback']);
