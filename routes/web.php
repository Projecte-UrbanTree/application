<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LandingFormDataController;

Route::get('/', function () {
    return view('landing');
});

Route::post('/landing-form-data', [LandingFormDataController::class, 'store']);

Route::get('{any}', function () {
    return view('application');
})->where('any', '.*');
