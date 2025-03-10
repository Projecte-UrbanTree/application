<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Contract;

class ContractController extends Controller
{
    public function getContracts()
    {
        return response()->json(Contract::all());
    }

    public function getContract(int $contractId)
    {
        $contract = Contract::find($contractId);

        if (!$contract) {
            return response()->json([
                'message' => 'Contrato no encontrado.'
            ], 400);
        }

        return response()->json($contract);
    }
}
