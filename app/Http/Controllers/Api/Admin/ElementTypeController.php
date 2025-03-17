<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ElementType;
use Illuminate\Http\Request;

class ElementTypeController extends Controller
{
    public function index()
    {
        $elementType = ElementType::all();

        return response()->json($elementType);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'requires_tree_type' => ['required', 'boolean'],
            'description' => ['nullable', 'string'],
            'icon' => ['required', 'string'],
            'color' => ['required', 'string'],
        ]);

        $element_type = ElementType::create($validated);

        return response()->json($element_type, 201);
    }

    public function show($id)
    {
        $element_type = ElementType::findOrFail($id);

        return response()->json($element_type);
    }

    public function update(Request $request, $id)
    {
        $element_type = ElementType::findOrFail($id);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'requires_tree_type' => ['required', 'boolean'],
            'description' => ['nullable', 'string'],
            'icon' => ['required', 'string', 'max:255'],
            'color' => ['required', 'string', 'max:255'],
        ]);

        $element_type->update($validated);

        return response()->json($element_type);
    }

    public function destroy($id)
    {
        $element_type = ElementType::findOrFail($id);
        $element_type->delete();

        return response()->json(['message' => 'Elemento eliminado eliminado'], 200);
    }

    public function icons()
    {
        $icons = [
            'tree',
            'home',
            'post-lamp',
            'park',
            'fountain',
            'flower',
            'mountain',
            'beach',
            'volcano',
            'tap',
            'water-drop',
            'lightbulb',
            'lightning-bolt',
            'grass',
            'cloud',
        ];

        return response()->json($icons);
    }
}
