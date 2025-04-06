<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contract;
use Illuminate\Http\JsonResponse;

class ContractController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse A JSON response containing the list of contracts.
     */
    public function index(): JsonResponse
    {
        $contracts = Contract::all();

        return response()->json($contracts);
    }
}
