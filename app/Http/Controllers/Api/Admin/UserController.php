<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Contract;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index()
    {
        return response()->json(User::with('contracts')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'surname' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'company' => ['nullable', 'string', 'max:255'],
            'dni' => ['nullable', 'string', 'max:50'],
            'role' => ['required', Rule::in(['admin', 'worker', 'customer'])],
            'password' => ['required', 'string', 'min:8'],
        ]);

        $validated['password'] = bcrypt($validated['password']);

        $user = User::create($validated);

        return response()->json($user, 201);
    }

    public function show($id)
    {
        $user = User::findOrFail($id);

        return response()->json($user);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'surname' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'email', Rule::unique('users', 'email')->ignore($user->id)],
            'company' => ['nullable', 'string', 'max:255'],
            'dni' => ['nullable', 'string', 'max:50'],
            'role' => ['sometimes', Rule::in(['admin', 'worker', 'customer'])],
            'password' => ['nullable', 'string', 'min:8'],
        ]);

        if (isset($validated['password']) && ! empty($validated['password'])) {
            $validated['password'] = bcrypt($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        return response()->json($user);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'Usuario eliminado'], 200);
    }

    public function workers(Request $request)
    {
        $contractId = $request->user()->selected_contract_id;
        $userByContract = $contractId > 0 ? Contract::find($contractId)?->workers : [];
        $users = User::where('role', 'worker')->get();

        return response()->json(['users' => $users, 'usersByContract' => $userByContract]);
    }
}
