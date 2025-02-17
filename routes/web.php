<?php

use App\Http\Controllers\LandingController;
use App\Http\Controllers\LangController;
use Illuminate\Support\Facades\Route;

Route::get('/landing{number}', function ($number) {
    return view("/Landings/landing$number");
})->where('number', '[0-9]+');

Route::post('/landing11/form', [LandingController::class, 'landing11'])->name('landing.form');

Route::get('/set-language/{lang}', [LangController::class, 'setLanguage'])->name('set-language');

Route::get('{any}', function () {
    return view('application');
})->where('any', '.*');
