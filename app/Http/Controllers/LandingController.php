<?php

namespace App\Http\Controllers;

use App\Models\LandingForm;
use Illuminate\Http\Request;

class LandingController extends Controller
{
    public function index(int $number)
    {
        return view("/Landings/landing$number");
    }

    public function store(int $number, Request $request)
    {
        switch ($number) {
            case 11:
                $request->validate([
                    'name' => 'required|string|max:150',
                    'email' => 'required|email|max:255',
                    'phone' => 'nullable|regex:/^(?=(?:\D*\d){9}\D*$)[0-9\s]+$/',
                    'message' => 'required|string|min:10|max:255',
                ]);

                $landingForm = new LandingForm;
                $landingForm->name = $request->name;
                $landingForm->email = $request->email;
                $landingForm->phone = $request->phone;
                $landingForm->message = $request->message;
                $landingForm->save();

                break;

            default:
                # code...
                break;
        }

        return redirect("/landing$number")->with('success', 'Mensaje enviado correctamente.');
    }
}
