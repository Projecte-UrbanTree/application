<?php

use App\Http\Controllers\LandingController;
use App\Http\Controllers\LangController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Admin\SensorController;

Route::resource('/', LandingController::class)->only(['index', 'store'])->names('landing');

Route::get('/set-language/{lang}', [LangController::class, 'setLanguage'])->name('set-language');

Route::prefix('api/admin')->group(function () {
    Route::get('/sensor/{sensorId}/history', [SensorController::class, 'getSensorHistory']);
});

Route::get('{any}', function () {
    return view('application');
})->where('any', '.*');
