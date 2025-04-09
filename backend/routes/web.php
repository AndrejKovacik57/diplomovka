<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});
Route::get('/stuba', function () {
    return view('stuba');
});
Route::post('/stuba', function () {
    return view('stuba');
});
//
use App\Http\Controllers\SVGController;

Route::get('/svg', [SVGController::class, 'renderText']);


