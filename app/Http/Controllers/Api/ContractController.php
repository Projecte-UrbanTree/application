<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contract;

class ContractController extends Controller
{
    public function index()
    {
        $contracts = Contract::all();
        return response()->json($contracts);
    }
}
