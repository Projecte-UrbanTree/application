<?php

use App\Http\Controllers\LandingController;
use App\Http\Controllers\LangController;
use Illuminate\Support\Facades\Route;

Route::get('/landing{number}', [LandingController::class, 'index'])->where('number', '[0-9]+')->name('landing');

Route::post('/landing{number}/form', [LandingController::class, 'store'])->where('number', '[0-9]+')->name('landing.form');

Route::get('/set-language/{lang}', [LangController::class, 'setLanguage'])->name('set-language');

Route::get('{any}', function () {
    return view('application');
})->where('any', '.*');
