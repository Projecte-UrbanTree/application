<?php

use App\Http\Controllers\LandingController;
use App\Http\Controllers\LangController;
use Illuminate\Support\Facades\Route;

Route::get('/landing11', [LandingController::class, 'index'])->name('landing');

Route::post('/landing11/landing11-form', [LandingController::class, 'store'])->name('landing.form');

Route::get('/landing11/set-language/{lang}', [LangController::class, 'setLanguage'])->name('set-language');

Route::get('{any}', function () {
    return view('application');
})->where('any', '.*');
