<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Zone;
use Illuminate\Http\Request;

class ZoneController extends Controller
{
    public function index()
    {
        return Zone::all();
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
