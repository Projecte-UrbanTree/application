<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Element;
use Illuminate\Http\Request;

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
        $validated = $request->validate([
            'description' => ['nullable', 'string', 'max:255'],
            'element_type_id' => ['required', 'integer'],
            'tree_type_id' => ['required', 'integer'],
            'point_id' => ['required', 'integer'],
        ]);

        $element = Element::create($validated);

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
        $validated = $request->validate([
            'description' => ['nullable', 'string', 'max:255'],
            'element_type_id' => ['nullable', 'integer'],
            'tree_type_id' => ['nullable', 'integer'],
            'point_id' => ['nullable', 'integer'],
        ]);

        $element = Element::findOrFail($id);
        $element->update($validated);

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
