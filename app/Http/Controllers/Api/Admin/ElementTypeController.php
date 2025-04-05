<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ElementType;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ElementTypeController extends Controller
{
    public function index(): JsonResponse
    {
        $elementTypes = ElementType::all();

        return response()->json($elementTypes);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'requires_tree_type' => ['required', 'boolean'],
            'description' => ['nullable', 'string'],
            'icon' => ['required', 'string', 'max:255'],
            'color' => ['required', 'string', 'max:255'],
        ]);

        $elementType = ElementType::create($validated);

        return response()->json($elementType, 201);
    }

    public function show($id): JsonResponse
    {
        $elementType = ElementType::findOrFail($id);

        return response()->json($elementType);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $elementType = ElementType::findOrFail($id);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'requires_tree_type' => ['required', 'boolean'],
            'description' => ['nullable', 'string'],
            'icon' => ['required', 'string', 'max:255'],
            'color' => ['required', 'string', 'max:255'],
        ]);

        $elementType->update($validated);

        return response()->json($elementType);
    }

    public function destroy($id): JsonResponse
    {
        $elementType = ElementType::findOrFail($id);
        $elementType->delete();

        return response()->json(['message' => 'Elemento eliminado'], 200);
    }

    public function icons(): JsonResponse
    {
        $icons = [
            'tree', 'home', 'post-lamp', 'park', 'fountain', 'flower', 'mountain',
            'beach', 'volcano', 'tap', 'water-drop', 'lightbulb', 'lightning-bolt',
            'grass', 'cloud',
        ];

        return response()->json($icons);
    }
}
