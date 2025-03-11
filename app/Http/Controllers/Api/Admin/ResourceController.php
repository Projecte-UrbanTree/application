<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Resource;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ResourceController extends Controller
{
    public function index()
    {
        return response()->json(Resource::with('resourceType')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:255'],
            'resource_type_id' => ['required', 'exists:resource_types,id'],
        ]);

        try {
            $resource = Resource::create($validated);
            $resource->load('resourceType');

            return response()->json($resource, 201);
        } catch (\Throwable $th) {
            return response()->json(['message' => 'Error al crear el recurso'], 500);
        }

    }

    public function show($id)
    {
        $resource = Resource::findOrFail($id);

        return response()->json($resource);
    }

    public function update(Request $request, $id)
    {
        $resource = Resource::findOrFail($id);

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255', Rule::unique('resources', 'name')->ignore($resource->id)],
            'description' => ['sometimes', 'string', 'max:255'],
            'resource_type_id' => ['sometimes', 'exists:resource_types,id'],
        ]);

        try {
            $resource->update($validated);

            return response()->json($resource, 201);
        } catch (\Throwable $th) {
            return response()->json(['message' => 'Error al actualizar el recurso'], 500);
        }
    }

    public function destroy($id)
    {
        $resource = Resource::findOrFail($id);
        $resource->delete();

        return response()->json(['message' => 'Usuario eliminado'], 200);
    }
}
