<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Contract;
use App\Models\User;
use Illuminate\Http\Request;

class ContractUserController extends Controller
{
    /**
     * Display a listing of the users assigned to a contract.
     */
    public function index(Contract $contract)
    {
        return response()->json($contract->workers);
    }

    /**
     * Assign a user to a contract.
     */
    public function store(Request $request, Contract $contract, User $user)
    {
        if ($user->role !== 'worker') {
            return response()->json(['error' => 'Only workers can be assigned'], 403);
        }

        $contract->workers()->syncWithoutDetaching([$user->id]);

        return response()->json(['message' => 'Worker assigned successfully']);
    }

    /**
     * Remove a user from a contract.
     */
    public function destroy(Contract $contract, User $user)
    {
        if (!$contract->workers()->where('user_id', $user->id)->exists()) {
            return response()->json(['error' => 'Worker not assigned to this contract'], 404);
        }

        $contract->workers()->detach($user->id);

        return response()->json(['message' => 'Worker removed from contract']);
    }
}
