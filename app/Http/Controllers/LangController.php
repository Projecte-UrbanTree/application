<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Cookie;

class LangController extends Controller
{
    public function setLanguage($lang)
    {
        App::setLocale($lang);
        Cookie::queue('locale', $lang, 60 * 24 * 30);
        return redirect()->back();
    }
}
