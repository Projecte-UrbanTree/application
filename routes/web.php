<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LandingFormController;

// Aumentar el tiempo máximo de ejecución a 60 segundos
ini_set('max_execution_time', 60);

Route::get('/landing',function(){
    return view('landing');
});

Route::get('/', function () {
    return view('application');
})->where('any', '.*');

Route::post('/landing', [LandingFormController::class, 'store'])->name('landingform.store');