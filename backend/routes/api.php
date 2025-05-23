<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\AuthControllerThirdParty;
use App\Http\Controllers\ExerciseController;
use App\Http\Controllers\GuestController;
use App\Http\Controllers\SolutionController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\TeacherController;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

Route::post('auth/signup', [AuthController::class, 'signUp']);
Route::post('auth/login', [AuthController::class, 'login']);
Route::get('auth/google', [AuthControllerThirdParty::class, 'redirectToAuthGoogle']);
Route::get('auth/google/callback', [AuthControllerThirdParty::class, 'handleAuthCallback']);
Route::post('/forgot-password', [GuestController::class, 'sendResetLinkEmail']);
Route::post('/reset-password', [GuestController::class, 'resetPassword']);



Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
    $user = $request->user();
    $request->fulfill();
    return response()->json(['message' => 'Email verified successfully', 'user' => $user]);
})->middleware(['auth:sanctum', 'signed'])->name('verification.verify');

Route::post('/email/verification-notification', function (Request $request) {
    $request->user()->sendEmailVerificationNotification();
    return response()->json(['message' => 'Verification link sent!']);
})->middleware(['auth:sanctum', 'throttle:6,1']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('me', fn(Request $request) => $request->user());
    Route::post('auth/logout', [AuthController::class, 'logout']);
    Route::post('ais/login', [AuthControllerThirdParty::class, 'AISLogin']);
    Route::apiResource('solutions', SolutionController::class);
    Route::get('me/exercises', [StudentController::class, 'getUsersCourseExercises']);
    Route::get('me/courses/{courseId}/exercises/{exerciseId}', [StudentController::class, 'getUserExercise']);
    Route::get('me/solutions', [StudentController::class, 'getUserSolutions']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);
});

Route::middleware(['auth:sanctum', 'teacher'])->group(function () {
    Route::apiResource('courses', CourseController::class);
    Route::apiResource('exercises', ExerciseController::class);
    Route::get('/courses/exercises/{courseExercise}/solutions/export', [TeacherController::class, 'exerciseSolutionsToCsv']);
    Route::post('courses/{course}/exercises/{exercise}', [TeacherController::class, 'addExercise']);
    Route::patch('courses/exercises/dates', [TeacherController::class, 'updateDatesCourseExercise']);
    Route::get('courses/{courseId}/users/{userId}/exercises/solutions', [TeacherController::class, 'getUserSolutions']);

});


