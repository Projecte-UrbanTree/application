<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Display a listing of users.
     *
     * @return JsonResponse A JSON response containing the list of users.
     */
    public function index(): JsonResponse
    {
        $users = User::all();

        return response()->json($users);
    }

    /**
     * Store a newly created user in storage.
     *
     * @param  Request  $request  The HTTP request instance.
     * @return JsonResponse A JSON response containing the created user.
     */
    public function store(Request $request): JsonResponse
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

    /**
     * Display the specified user.
     *
     * @param  int  $id  The ID of the user to retrieve.
     * @return JsonResponse A JSON response containing the user details.
     */
    public function show($id): JsonResponse
    {
        $user = User::findOrFail($id);

        return response()->json($user);
    }

    /**
     * Update the specified user in storage.
     *
     * @param  Request  $request  The HTTP request instance.
     * @param  int  $id  The ID of the user to update.
     * @return JsonResponse A JSON response containing the updated user.
     */
    public function update(Request $request, $id): JsonResponse
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

        if (isset($validated['password'])) {
            $validated['password'] = bcrypt($validated['password']);
        }

        $user->update($validated);

        return response()->json($user);
    }

    /**
     * Remove the specified user from storage.
     *
     * @param  int  $id  The ID of the user to delete.
     * @return JsonResponse A JSON response confirming the deletion.
     */
    public function destroy($id): JsonResponse
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'Usuario eliminado'], 200);
    }
}
