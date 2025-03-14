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

        $validated['start_date'] = date('Y-m-d', strtotime($validated['start_date']));
        $validated['end_date'] = date('Y-m-d', strtotime($validated['end_date']));

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

        if (isset($validated['start_date'])) {
            $validated['start_date'] = date('Y-m-d', strtotime($validated['start_date']));
        }
        if (isset($validated['end_date'])) {
            $validated['end_date'] = date('Y-m-d', strtotime($validated['end_date']));
        }

        $contract->update($validated);

        return response()->json($contract);
    }

    public function destroy($id)
    {
        $contract = Contract::findOrFail($id);
        $contract->delete();

        return response()->json(['message' => 'Contract deleted'], 200);
    }

    public function selectContract(Request $request)
    {
        $validated = $request->validate([
            'contract_id' => [
                'nullable',
                'integer',
                function ($attribute, $value, $fail) {
                    if ($value !== 0 && !Contract::find($value)) {
                        $fail('The selected contract does not exist.');
                    }
                }
            ]
        ]);

        $contractId = $validated['contract_id'] ?? 0;
        $request->session()->put('selected_contract_id', $contractId);

        $contract = $contractId > 0 ? Contract::find($contractId) : null;

        return response()->json([
            'message' => 'Contract selected successfully',
            'contract' => $contract
        ]);
    }

    public function getSelectedContract(Request $request)
    {
        $contractId = $request->session()->get('selected_contract_id', null);
        $contract = $contractId > 0 ? Contract::find($contractId) : null;

        return response()->json([
            'contract_id' => $contractId,
            'contract' => $contract
        ]);
    }
}
