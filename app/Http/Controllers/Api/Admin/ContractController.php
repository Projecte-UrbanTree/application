<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Contract;
use App\Services\ContractDuplicationService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ContractController extends Controller
{
    /**
     * Display a listing of contracts.
     *
     * @return JsonResponse A JSON response containing the list of contracts.
     */
    public function index(): JsonResponse
    {
        $contracts = Contract::all();

        return response()->json($contracts);
    }

    /**
     * Store a newly created contract in storage.
     *
     * @param Request $request The HTTP request instance.
     * @return JsonResponse A JSON response containing the created contract.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date'],
            'final_price' => ['required', 'integer', 'min:0'],
            'status' => ['required', Rule::in([0, 1, 2])],
        ]);

        $validated['start_date'] = Carbon::parse($validated['start_date'])->format('Y-m-d');
        $validated['end_date'] = Carbon::parse($validated['end_date'])->format('Y-m-d');

        $contract = Contract::create($validated);

        return response()->json($contract, 201);
    }

    /**
     * Display the specified contract.
     *
     * @param int $id The ID of the contract to retrieve.
     * @return JsonResponse A JSON response containing the contract details.
     */
    public function show($id): JsonResponse
    {
        $contract = Contract::findOrFail($id);

        return response()->json($contract);
    }

    /**
     * Update the specified contract in storage.
     *
     * @param Request $request The HTTP request instance.
     * @param int $id The ID of the contract to update.
     * @return JsonResponse A JSON response containing the updated contract.
     */
    public function update(Request $request, $id): JsonResponse
    {
        $contract = Contract::findOrFail($id);

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'start_date' => ['sometimes', 'date'],
            'end_date' => ['sometimes', 'date'],
            'final_price' => ['sometimes', 'integer', 'min:0'],
            'status' => ['sometimes', Rule::in([0, 1, 2])],
        ]);

        if (isset($validated['start_date'])) {
            $validated['start_date'] = Carbon::parse($validated['start_date'])->format('Y-m-d');
        }
        if (isset($validated['end_date'])) {
            $validated['end_date'] = Carbon::parse($validated['end_date'])->format('Y-m-d');
        }

        $contract->update($validated);

        return response()->json($contract);
    }

    /**
     * Remove the specified contract from storage.
     *
     * @param int $id The ID of the contract to delete.
     * @return JsonResponse A JSON response confirming the deletion.
     */
    public function destroy($id): JsonResponse
    {
        $contract = Contract::findOrFail($id);
        $contract->delete();

        return response()->json(['message' => 'Contract deleted'], 200);
    }

    /**
     * Select a contract for the session.
     *
     * @param Request $request The HTTP request instance.
     * @return JsonResponse A JSON response confirming the contract selection.
     */
    public function selectContract(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'contract_id' => [
                'nullable',
                'integer',
                function ($attribute, $value, $fail) {
                    if ($value !== 0 && !Contract::find($value)) {
                        $fail('The selected contract does not exist.');
                    }
                },
            ],
        ]);

        $contractId = $validated['contract_id'] ?? 0;
        $request->session()->put('selected_contract_id', $contractId);

        $contract = $contractId > 0 ? Contract::find($contractId) : null;

        return response()->json([
            'message' => 'Contract selected successfully',
            'contract' => $contract,
        ]);
    }

    /**
     * Retrieve the selected contract from the session.
     *
     * @param Request $request The HTTP request instance.
     * @return JsonResponse A JSON response with the currently selected contract.
     */
    public function getSelectedContract(Request $request): JsonResponse
    {
        $contractId = $request->session()->get('selected_contract_id', null);
        $contract = $contractId > 0 ? Contract::find($contractId) : null;

        return response()->json([
            'contract_id' => $contractId,
            'contract' => $contract,
        ]);
    }

    /**
     * Duplicate an existing contract.
     *
     * @param int $id The ID of the contract to duplicate.
     * @return JsonResponse A JSON response containing the duplicated contract.
     */
    public function duplicate($id): JsonResponse
    {
        $service = app(ContractDuplicationService::class);
        $newContract = $service->duplicate($id);

        return response()->json([
            'message' => 'Contract duplicated successfully',
            'contract' => $newContract,
        ]);
    }
}
