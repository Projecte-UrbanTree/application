<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AccountController extends Controller
{
    public function show()
    {
        $user = Auth::user();
        return response()->json([
            "name" => $user->name,
            "surname" => $user->surname,
            "email" => $user->email,
            "company" => $user->company,
            "dni" => $user->dni,
            "role" => $user->role,
        ]);
    }

    public function update(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'surname' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'company' => ['nullable', 'string', 'max:255'],
            'dni' => ['nullable', 'string', 'max:50'],
        ]);

        $user->update($validated);

        return response()->json(["message" => "Perfil actualizado correctamente"]);
    }

    public function updatePassword(Request $request)
    {
        $request->validate([
            'currentPassword' => 'required',
            'newPassword' => 'required|min:6|confirmed',
        ]);

        $user = Auth::user();

        if (!Hash::check($request->input('currentPassword'), $user->password)) {
            return response()->json(["error" => "La contraseña actual no es correcta"], 400);
        }

        $user->password = Hash::make($request->input('newPassword'));
        $user->save();

        return response()->json(["message" => "Contraseña actualizada correctamente"]);
    }
}
