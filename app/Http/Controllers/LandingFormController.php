<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\LandingForm;

class LandingFormController extends Controller
{
    public function store(Request $request)
    {
        // Validar los datos del formulario
        $request->validate([
            'email' => 'required|email',
            'subject' => 'required|string|max:255',
            'message' => 'string',
        ]);

        // Guardar los datos en la base de datos
        LandingForm::create([
            'email' => $request->email,
            'subject' => $request->subject,
            'message' => $request->message,
        ]);

        // Redirigir con un mensaje de éxito
        return redirect()->back()->with('success', 'Mensaje enviado correctamente.');
    }
}
