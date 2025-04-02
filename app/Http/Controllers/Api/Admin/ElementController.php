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
        abort(404);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validate = $request->validate([
            'description' => ['required', 'string', 'max:255'],
            'element_type_id' => ['required', 'integer'],
            'tree_type_id' => ['required', 'integer'],
            'point_id' => ['required', 'integer'],
        ]);
        $element = Element::create($validate);

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
        abort(404);
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
        $element = Element::find($id);
        if (! $element) {
            return response()->json(['message' => 'Element not found'], 404);
        }
        $element->delete();

        return response()->json(['message' => 'Element deleted successfully'], 200);
    }
}
