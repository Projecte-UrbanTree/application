<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Point;
use Illuminate\Http\Request;

class PointController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Point::all());
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
        $point = Point::create($request->all());

        return response()->json($point, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $point = Point::findOrFail($id);

        return response()->json($point);
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
        $point = Point::findOrFail($id);
        $point->update($request->all());

        return response()->json($point);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Point::destroy($id);

        return response()->json(null, 204);
    }
}
