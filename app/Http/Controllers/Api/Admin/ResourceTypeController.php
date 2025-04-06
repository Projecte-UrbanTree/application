<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ResourceType;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ResourceTypeController extends Controller
{
    /**
     * Display a listing of resource types.
     *
     * @return JsonResponse A JSON response containing the list of resource types.
     */
    public function index(): JsonResponse
    {
        $resourceTypes = ResourceType::all();

        return response()->json($resourceTypes);
    }

    /**
     * Store a newly created resource type in storage.
     *
     * @param Request $request The HTTP request instance.
     * @return JsonResponse A JSON response containing the created resource type.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['sometimes', 'string', 'nullable'],
        ]);

        $resourceType = ResourceType::create($validated);

        return response()->json($resourceType, 201);
    }

    /**
     * Display the specified resource type.
     *
     * @param int $id The ID of the resource type to retrieve.
     * @return JsonResponse A JSON response containing the resource type details.
     */
    public function show($id): JsonResponse
    {
        $resourceType = ResourceType::findOrFail($id);

        return response()->json($resourceType);
    }

    /**
     * Update the specified resource type in storage.
     *
     * @param Request $request The HTTP request instance.
     * @param int $id The ID of the resource type to update.
     * @return JsonResponse A JSON response containing the updated resource type.
     */
    public function update(Request $request, $id): JsonResponse
    {
        $resourceType = ResourceType::findOrFail($id);

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'string', 'nullable'],
        ]);

        $resourceType->update($validated);

        return response()->json($resourceType);
    }

    /**
     * Remove the specified resource type from storage.
     *
     * @param int $id The ID of the resource type to delete.
     * @return JsonResponse A JSON response confirming the deletion.
     */
    public function destroy($id): JsonResponse
    {
        $resourceType = ResourceType::findOrFail($id);
        $resourceType->delete();

        return response()->json(['message' => 'Tipo de recurso eliminado'], 200);
    }
}
