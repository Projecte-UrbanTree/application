<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ResourceType;
use Illuminate\Http\Request;

class ResourceTypeController extends Controller
{
    public function index()
    {
        return response()->json(ResourceType::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'null'],
        ]);

        $resourceType = ResourceType::create($validated);

        return response()->json($resourceType, 201);
    }

    public function show($id)
    {
        $resourceType = ResourceType::findOrFail($id);

        return response()->json($resourceType);
    }

    public function update(Request $request, $id)
    {
        $resourceType = ResourceType::findOrFail($id);

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'string', 'null'],
        ]);

        $resourceType->update($validated);

        return response()->json($resourceType);
    }

    public function destroy($id)
    {
        $resourceType = ResourceType::findOrFail($id);
        $resourceType->delete();

        return response()->json(['message' => 'Tipo de recurso eliminado'], 200);
    }
}
