<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

use App\Http\Controllers\SVGController;

Route::get('/svg', [SVGController::class, 'renderText']);


