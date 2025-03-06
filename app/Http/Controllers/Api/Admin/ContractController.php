<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Contract;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ContractController extends Controller
{
    public function index()
    {
        return response()->json(Contract::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date'],
            'final_price' => ['required', 'numeric'],
            'status' => ['required', Rule::in([0, 1, 2])],
        ]);

        $contract = Contract::create($validated);

        return response()->json($contract, 201);
    }

    public function show($id)
    {
        $contract = Contract::findOrFail($id);

        return response()->json($contract);
    }

    public function update(Request $request, $id)
    {
        $contract = Contract::findOrFail($id);

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'start_date' => ['sometimes', 'date'],
            'end_date' => ['sometimes', 'date'],
            'final_price' => ['sometimes', 'numeric'],
            'status' => ['sometimes', Rule::in([0, 1, 2])],
        ]);

        $contract->update($validated);

        return response()->json($contract);
    }

    public function destroy($id)
    {
        $contract = Contract::findOrFail($id);
        $contract->delete();

        return response()->json(['message' => 'Contrato eliminado'], 200);
    }
}
