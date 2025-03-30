<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Contract;
use App\Models\User;
use Illuminate\Http\Request;

class ContractUserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Contract $contract)
    {
        return response()->json($contract->workers);

    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
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
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Contract $contract, User $user)
    {
        if (! $contract->workers()->where('user_id', $user->id)->exists()) {
            return response()->json(['error' => 'Worker not assigned to this contract'], 404);
        }

        $contract->workers()->detach($user->id);

        return response()->json(['message' => 'Worker removed from contract']);
    }
}
