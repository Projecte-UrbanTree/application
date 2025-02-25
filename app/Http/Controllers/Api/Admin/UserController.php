<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;

class UserController extends Controller
{
    public function index()
    {
        return response()->json(User::all());
    }

    public function store(REQUEST $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'surname' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'company' => 'nullable|string|max:255',
            'dni' => 'nullable|string|max:50',
            'role' => ['required', Rule::in(['admin', 'worker', 'customer'])],
        ]);

        $user = User::create($validated);

        return response()->json($user, 201);
    }

    public function show($id)
    {
        return response()->json(User::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'surname' => 'sometimes|string|max:255',
            'email' => ['sometimes', 'email', Rule::unique('users')->ignore($id)],
            'company' => 'nullable|string|max:255',
            'dni' => 'nullable|string|max:50',
            'role' => ['sometimes', Rule::in(['admin', 'worker', 'customer'])],
        ]);

        $user->update($validated);

        return response()->json($user);
    }

    public function destroy($id)
    {
        User::destroy($id);
        return response()->json(['message' => 'Usuario eliminado']);
    }
}
