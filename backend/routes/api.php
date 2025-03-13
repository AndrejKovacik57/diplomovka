<?php

use App\Http\Controllers\ExerciseController;
use App\Http\Controllers\FilesController;
use App\Http\Controllers\SolutionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::apiResource('exercise', ExerciseController::class);
Route::apiResource('test', \App\Http\Controllers\TestsController::class);
Route::apiResource('solution', SolutionController::class);
