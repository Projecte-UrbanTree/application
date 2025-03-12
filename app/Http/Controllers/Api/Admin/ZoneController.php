<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Zone;
use Illuminate\Http\Request;

class ZoneController extends Controller
{
    public function index(Request $request)
    {
        $contract_id = $request->header('X-Contract-Id');
        if(!$contract_id) return Zone::all();
        return Zone::where('contract_id', $contract_id)->get();
    }

    public function store(Request $request)
    {
        $validate = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:255'],
            'color' => ['required', 'string', 'max:255'],
            'contract_id' => ['required', 'integer', 'max:255'],
        ]);

        $zone = Zone::create($validate);

        return response()->json($zone, 201);
    }
}
