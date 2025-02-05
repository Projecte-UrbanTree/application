<?php

namespace App\Http\Controllers;

use App\Models\LandingForm;
use Illuminate\Http\Request;

class LandingFormController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:150',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|regex:/^(?=(?:\D*\d){9}\D*$)[0-9\s]+$/',
            'message' => 'required|string',
        ]);

        $landingForm = new LandingForm;
        $landingForm->name = $request->name;
        $landingForm->email = $request->email;
        $landingForm->phone = $request->phone;
        $landingForm->message = $request->message;
        $landingForm->save();

        return redirect('/')->with('success', 'Mensaje enviado correctamente.');
    }
}
