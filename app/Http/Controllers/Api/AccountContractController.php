<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contract;
use Illuminate\Http\Request;

class AccountContractController extends Controller
{
    /**
     * Show the form for creating the resource.
     */
    public function create(): never
    {
        abort(404);
    }

    /**
     * Store the newly created resource in storage.
     */
    public function store(Request $request): never
    {
        abort(404);
    }

    /**
     * Display the resource.
     */
    public function show(Request $request)
    {
        $contractId = session('selected_contract_id', null);
        $contract = $contractId > 0 ? Contract::find($contractId) : null;

        return response()->json([
            'contract_id' => $contractId,
            'contract' => $contract,
        ]);
    }

    /**
     * Show the form for editing the resource.
     */
    public function edit()
    {
        // if user is worker, return a list of the contracts assigned to him
        // if user is admin, return a list of all contracts
        $contracts = auth()->user()->role === 'worker'
            ? auth()->user()->contracts
            : Contract::all();

        return response()->json($contracts);

    }

    /**
     * Update the resource in storage.
     */
    public function update(Request $request)
    {
        $request->validate([
            'contract_id' => 'nullable|integer|exists:contracts,id',
        ]);

        $user = $request->user();
        $user->selected_contract_id = $request->contract_id;
        $user->save();

        return response()->json([
            'message' => 'Contract selected successfully',
            'selected_contract' => $user->selected_contract_id,
        ]);
    }

    /**
     * Remove the resource from storage.
     */
    public function destroy(): never
    {
        abort(404);
    }
}
