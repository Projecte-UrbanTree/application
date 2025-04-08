<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
     * Handle user login.
     *
     * @param  Request  $request  The HTTP request instance.
     * @return JsonResponse A JSON response containing the access token and user data, or an error message.
     */
    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (! $user || ! Hash::check($validated['password'], $user->password)) {
            return response()->json(['message' => __('auth.failed')], 401);
        }

        $token = $user->createToken($request->userAgent())->plainTextToken;

        return response()->json(['success' => true, 'accessToken' => $token, 'userData' => $user]);
    }

    /**
     * Handle user logout.
     *
     * @param  Request  $request  The HTTP request instance.
     * @return JsonResponse A JSON response confirming the logout.
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['success' => true]);
    }
}
