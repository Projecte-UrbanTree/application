<?php

namespace App\Http\Controllers;

use App\Models\LandingForm;
use Illuminate\Http\Request;

class LandingController extends Controller
{
    public function index()
    {
        return view('landing');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'nullable|string|max:150',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|regex:/^(?=(?:\D*\d){9}\D*$)[0-9\s]+$/',
            'message' => 'nullable|string|min:10|max:255',
        ]);

        $landingForm = new LandingForm;
        $landingForm->name = $request->name;
        $landingForm->email = $request->email;
        $landingForm->phone = $request->phone;
        $landingForm->message = $request->message;
        $landingForm->save();

        return to_route('landing.index')->with('success', 'Mensaje enviado correctamente.');
    }
}
