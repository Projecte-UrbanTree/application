<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Resource;
use App\Models\ResourceType;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ResourceController extends Controller
{
    /**
     * Display a listing of resources.
     *
     * @param Request $request The HTTP request instance.
     * @return JsonResponse A JSON response containing the list of resources.
     */
    public function index(Request $request): JsonResponse
    {
        $contractId = $request->session()->get('selected_contract_id', 0);

        $resources = Resource::when($contractId > 0, fn ($query) => $query->where('contract_id', $contractId))
            ->with('resourceType')
            ->get();

        return response()->json($resources);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @param Request $request The HTTP request instance.
     * @return JsonResponse A JSON response containing resource types for creation.
     */
    public function create(Request $request): JsonResponse
    {
        $contractId = $request->session()->get('selected_contract_id', null);

        if ($contractId <= 0) {
            return response()->json(['message' => 'Debe seleccionar un contrato'], 400);
        }

        return response()->json(['resource_types' => ResourceType::all()]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request The HTTP request instance.
     * @return JsonResponse A JSON response containing the created resource.
     */
    public function store(Request $request): JsonResponse
    {
        $contractId = $request->session()->get('selected_contract_id', null);

        if ($contractId <= 0) {
            return response()->json(['message' => 'Debe seleccionar un contrato'], 400);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:255'],
            'resource_type_id' => ['required', 'integer'],
            'unit_name' => ['required', 'string', 'max:255'],
            'unit_cost' => ['required', 'numeric'],
        ]);

        $validated['contract_id'] = $contractId;

        $resource = Resource::create($validated);
        $resource->load('resourceType');

        return response()->json($resource, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param Resource $resource The resource model instance.
     * @return JsonResponse A JSON response containing the resource details.
     */
    public function show(Resource $resource): JsonResponse
    {
        return response()->json($resource);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param Resource $resource The resource model instance.
     * @return JsonResponse A JSON response containing the resource and resource types.
     */
    public function edit(Resource $resource): JsonResponse
    {
        return response()->json(['resource' => $resource, 'resource_types' => ResourceType::all()]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request The HTTP request instance.
     * @param Resource $resource The resource model instance.
     * @return JsonResponse A JSON response containing the updated resource.
     */
    public function update(Request $request, Resource $resource): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:255'],
            'resource_type_id' => ['sometimes', 'required', 'integer'],
            'unit_name' => ['nullable', 'string', 'max:255'],
            'unit_cost' => ['nullable', 'numeric'],
        ]);

        $resource->update($validated);
        $resource->load('resourceType');

        return response()->json($resource, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Resource $resource The resource model instance.
     * @return JsonResponse A JSON response confirming the deletion.
     */
    public function destroy(Resource $resource): JsonResponse
    {
        $resource->delete();

        return response()->json(['message' => 'Recurso eliminado'], 200);
    }
}
