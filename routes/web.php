<?php

use App\Http\Controllers\LandingFormController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('landing');
});

Route::post('/landing-form', [LandingFormController::class, 'store']);

Route::get('{any}', function () {
    return view('application');
})->where('any', '.*');
