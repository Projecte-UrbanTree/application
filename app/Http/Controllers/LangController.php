<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Cookie;

class LangController extends Controller
{
    public function setLanguage($lang)
    {
        App::setLocale($lang);
        Cookie::queue(Cookie::make('lang', $lang, 525600, '/', null, false, false));

        return redirect()->back();
    }
}
