<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\AuthControllerThirdParty;
use App\Http\Controllers\ExerciseController;
use App\Http\Controllers\SolutionController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\TeacherController;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
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
    Route::post('course/{course}/exercise/{exercise}', [TeacherController::class, 'addExercise']);
    Route::post('course/exercise/updateDates', [TeacherController::class, 'updateDatesCourseExercise']);
    Route::get('course/{courseId}/user/{userId}/exercise/solutions', [TeacherController::class, 'getUserSolutions']);
    Route::get('user/getExercises', [\App\Http\Controllers\UserController::class, 'userExercises']);
});

// Public Routes (Auth-related)
Route::post('signup', [AuthController::class, 'signUp']);
Route::post('login', [AuthController::class, 'login']);

Route::get('auth', [AuthControllerThirdParty::class, 'redirectToAuthGoogle']);
Route::get('auth/callback', [AuthControllerThirdParty::class, 'handleAuthCallback']);

Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
    $user = $request->user();
    $request->fulfill();
    return response()->json(['message' => 'Email verified successfully', 'user'=>$user]);
})->middleware(['auth:sanctum', 'signed'])->name('verification.verify');




// Optional: Allow resending verification email
Route::post('/email/verification-notification', function (Request $request) {
    $request->user()->sendEmailVerificationNotification();
    return response()->json(['message' => 'Verification link sent!']);
})->middleware(['auth:sanctum', 'throttle:6,1']);
