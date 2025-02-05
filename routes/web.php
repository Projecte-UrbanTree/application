<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LandingFormController;

Route::get('/', function () {
    return view('landing');
});

Route::post('/landing-form', [LandingFormController::class, 'store']);

Route::get('{any}', function () {
    return view('application');
})->where('any', '.*');
