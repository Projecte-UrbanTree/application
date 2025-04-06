<?php

namespace App\Http\Controllers;

use App\Models\LandingForm;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class LandingController extends Controller
{
    /**
     * Display the landing page.
     *
     * @return View The landing page view.
     */
    public function index(): View
    {
        return view('landing');
    }

    /**
     * Store a new landing form submission.
     *
     * @param  Request  $request  The HTTP request instance.
     * @return RedirectResponse A redirect response to the landing page with a success message.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'nullable|string|max:150',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|regex:/^(?=(?:\D*\d){9}\D*$)[0-9\s]+$/',
            'message' => 'nullable|string|min:10|max:255',
        ]);

        $landingForm = new LandingForm;
        $landingForm->name = $validated['name'];
        $landingForm->email = $validated['email'];
        $landingForm->phone = $validated['phone'];
        $landingForm->message = $validated['message'];
        $landingForm->save();

        return to_route('landing.index')->with('success', 'Mensaje enviado correctamente.');
    }
}
