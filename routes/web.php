<?php

use App\Http\Controllers\LandingController;
use App\Http\Controllers\LangController;
use Illuminate\Support\Facades\Route;

Route::get('/', [LandingController::class, 'index'])->name('home');

Route::get('/set-language/{lang}', [LangController::class, 'setLanguage'])->name('set-language');

Route::post('/landing-form', [LandingController::class, 'store'])->name('form');

Route::get('{any}', function () {
    return view('application');
})->where('any', '.*');
