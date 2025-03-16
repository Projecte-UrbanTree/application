<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\Element;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ElementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Element::all());
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
        $element = Element::create($request->all());
        return response()->json($element, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $element = Element::with(['eva', 'point', 'treeType'])->findOrFail($id);
        return response()->json($element);
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
        $element = Element::findOrFail($id);
        $element->update($request->all());
        return response()->json($element);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Element::destroy($id);
        return response()->json(null, 204);
    }
}