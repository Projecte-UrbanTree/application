<?php

use App\Http\Controllers\LandingController;
use App\Http\Controllers\LangController;
use Illuminate\Support\Facades\Route;

Route::resource('/', LandingController::class)->only(['index', 'store']);

Route::get('/set-language/{lang}', [LangController::class, 'setLanguage'])->name('set-language');

Route::get('{any}', function () {
    return view('application');
})->where('any', '.*');
