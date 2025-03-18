<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Zone;
use Illuminate\Http\Request;

class ZoneController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Zone::all());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Not needed for API
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $zone = Zone::create($request->all());

        return response()->json($zone, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $zone = Zone::findOrFail($id);

        return response()->json($zone);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        // Not needed for API
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $zone = Zone::findOrFail($id);
        $zone->update($request->all());

        return response()->json($zone);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Zone::destroy($id);

        return response()->json(null, 204);
    }
}
