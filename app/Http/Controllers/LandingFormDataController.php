<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\LandingFormData;

class LandingFormDataController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name'    => 'required|string|max:150',
            'email'   => 'required|email|max:255',
            'phone'   => 'nullable|regex:/^(?=(?:\D*\d){9}\D*$)[0-9\s]+$/',
            'message' => 'required|string',
        ]);

        $landingFormData = new LandingFormData();
        $landingFormData->name = $request->name;
        $landingFormData->email = $request->email;
        $landingFormData->phone = $request->phone;
        $landingFormData->message = $request->message;
        $landingFormData->save();

        return redirect('/')->with('success', 'Mensaje enviado correctamente.');
    }
}
