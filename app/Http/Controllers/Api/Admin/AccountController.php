<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AccountController extends Controller
{
    /**
     * Display the authenticated user's account details.
     *
     * @return JsonResponse A JSON response containing the user's account details.
     */
    public function show(): JsonResponse
    {
        $user = Auth::user();

        return response()->json([
            'name' => $user->name,
            'surname' => $user->surname,
            'email' => $user->email,
            'company' => $user->company,
            'dni' => $user->dni,
            'role' => $user->role,
        ]);
    }

    /**
     * Update the authenticated user's account details.
     *
     * @param  Request  $request  The HTTP request instance.
     * @return JsonResponse A JSON response confirming the update.
     */
    public function update(Request $request): JsonResponse
    {
        $user = Auth::user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'surname' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,'.$user->id],
            'company' => ['nullable', 'string', 'max:255'],
            'dni' => ['nullable', 'string', 'max:50'],
        ]);

        $user->update($validated);

        return response()->json(['message' => 'Perfil actualizado correctamente']);
    }

    /**
     * Update the authenticated user's password.
     *
     * @param  Request  $request  The HTTP request instance.
     * @return JsonResponse A JSON response confirming the password update.
     */
    public function updatePassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'currentPassword' => ['required'],
            'newPassword' => ['required', 'min:6', 'confirmed'],
        ]);

        $user = Auth::user();

        if (! Hash::check($validated['currentPassword'], $user->password)) {
            return response()->json(['error' => 'La contraseña actual no es correcta'], 400);
        }

        $user->password = Hash::make($validated['newPassword']);
        $user->save();

        return response()->json(['message' => 'Contraseña actualizada correctamente']);
    }
}
