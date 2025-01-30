<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JSONResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function login(): JSONResponse
    {
        $credentials = request(['email', 'password']);

        if (! auth()->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $token = auth()->user()->createToken('accessToken')->plainTextToken;

        return response()->json(['success' => true, 'accessToken' => $token]);
    }

    public function logout(Request $request): JSONResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['success' => true]);
    }
}
