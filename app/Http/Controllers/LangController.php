<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Cookie;

class LangController extends Controller
{
    /**
     * Set the application language.
     *
     * @param string $lang The language code to set.
     * @return RedirectResponse A redirect response back to the previous page.
     */
    public function setLanguage(string $lang): RedirectResponse
    {
        App::setLocale($lang);
        Cookie::queue(Cookie::make('lang', $lang, 525600, '/', null, false, false));

        return redirect()->back();
    }
}
