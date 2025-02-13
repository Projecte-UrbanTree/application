<?php

use App\Http\Controllers\LandingController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Cookie;

Route::get('/', function () {
    return view('landing');
});

Route::get('/set-language/{lang}', function ($lang) {
    App::setLocale($lang);
    Cookie::queue('locale', $lang, 60 * 24 * 30);
    return redirect()->back();
})->name('set-language');

Route::post('/landing-form', [LandingController::class, 'store'])->name('form');

Route::get('{any}', function () {
    return view('application');
})->where('any', '.*');
