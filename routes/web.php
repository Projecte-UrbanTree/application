<?php

use App\Http\Controllers\LandingController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('landing');
});

Route::post('/form', [LandingController::class, 'store'])->name('form');

Route::get('{any}', function () {
    return view('application');
})->where('any', '.*');
