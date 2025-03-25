<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreResourceRequest;
use App\Http\Requests\UpdateResourceRequest;
use App\Models\Resource;
use App\Models\ResourceType;
use Illuminate\Http\Request;

class ResourceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $contractId = $request->session()->get('selected_contract_id', 0);

            $resources = Resource::when($contractId > 0, function ($query) use ($contractId) {
                return $query->where('contract_id', $contractId);
            })
                ->with('resourceType')
                ->get();

            return response()->json($resources);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching resources',
                'debug_message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $contractId = $request->session()->get('selected_contract_id', null);
        if ($contractId <= 0) {
            return response()->json(['message' => 'Debe seleccionar un contrato'], 400);
        }

        return response()->json(['resource_types' => ResourceType::all()]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreResourceRequest $request)
    {
        $contractId = $request->session()->get('selected_contract_id', null);
        if ($contractId <= 0) {
            return response()->json(['message' => 'Debe seleccionar un contrato'], 400);
        }

        $validated = $request->validated();
        $validated['contract_id'] = $contractId;
        $validated['unit_cost'] = $request->input('unit_cost', 0);
        $validated['unit_name'] = $request->input('unit_name', '');

        try {
            $resource = Resource::create($validated);
            $resource->load('resourceType');

            return response()->json($resource, 201);
        } catch (\Throwable $th) {
            return response()->json(['message' => 'Error al crear el recurso'], 500);
        }
    }
    /**
     * Display the specified resource.
     */
    public function show(Resource $resource)
    {
        return response()->json($resource);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Resource $resource)
    {
        return response()->json(['resource' => $resource, 'resource_types' => ResourceType::all()]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateResourceRequest $request, Resource $resource)
    {
        try {
            $validated = $request->validated();

            $resource->update([
                'name' => $validated['name'],
                'description' => $validated['description'],
                'resource_type_id' => $validated['resource_type_id'],
                'unit_cost' => $validated['unit_cost'],
                'unit_name' => $validated['unit_name']
            ]);

            $resource->load('resourceType');

            return response()->json($resource, 200);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'Error al actualizar el recurso',
                'error' => $th->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Resource $resource)
    {
        try {
            $resource->delete();

            return response()->json(['message' => 'Recurso eliminado'], 200);
        } catch (\Throwable $th) {
            return response()->json(['message' => 'Error al eliminar el recurso'], 500);
        }
    }
}
