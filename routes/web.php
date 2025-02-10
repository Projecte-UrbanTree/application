<?php

use App\Http\Controllers\LandingController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LandingFormController;

Route::get('/landing',function(){
    return view('landing');
});

Route::get('/', function () {
    return view('application');
})->where('any', '.*');

Route::post('/landing', [LandingFormController::class, 'store'])->name('landingform.store');