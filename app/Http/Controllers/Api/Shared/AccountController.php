<?php

namespace App\Http\Controllers\Api\Shared;

use App\Http\Controllers\Controller;
use App\Models\Contract;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AccountController extends Controller
{
    public function show(Request $request)
    {
        $user = Auth::user();
        $user->contracts = $user->role !== 'admin'
            ? $user->contracts()->get()
            : Contract::where('status', 0)->get();

        return response()->json($user);
    }

    public function update(Request $request)
    {
        $user = Auth::user();

        if (count($request->all()) === 1 && $request->has('selected_contract_id')) {
            $validated = $request->validate([
                'selected_contract_id' => ['nullable', 'integer', 'exists:contracts,id'],
            ]);
        } else {
            $validated = $request->validate([
                'company' => ['nullable', 'string', 'max:255'],
                'dni' => ['nullable', 'string', 'max:50'],
                'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,'.$user->id],
                'name' => ['required', 'string', 'max:255'],
                'selected_contract_id' => ['nullable', 'integer', 'exists:contracts,id'],
                'surname' => ['required', 'string', 'max:255'],
            ]);
        }

        $user->update($validated);

        return response()->json(['message' => 'Perfil actualizado correctamente']);
    }

    public function updatePassword(Request $request)
    {
        $request->validate([
            'currentPassword' => 'required',
            'newPassword' => 'required|min:6|confirmed',
        ]);

        $user = Auth::user();

        if (! Hash::check($request->input('currentPassword'), $user->password)) {
            return response()->json(['error' => 'La contraseña actual no es correcta'], 400);
        }

        $user->password = Hash::make($request->input('newPassword'));
        $user->save();

        return response()->json(['message' => 'Contraseña actualizada correctamente']);
    }
}
