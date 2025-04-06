<?php

namespace App\Http\Controllers\Api\Worker;

use App\Http\Controllers\Controller;
use App\Models\Resource;
use App\Models\ResourceType;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ResourceController extends Controller
{
    /**
     * Get all resource types.
     *
     * @return JsonResponse
     */
    public function resourceTypes(): JsonResponse
    {
        $resourceTypes = ResourceType::orderBy('name')->get();
        return response()->json($resourceTypes);
    }

    /**
     * Get all resources available for the current contract.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function resources(Request $request): JsonResponse
    {
        $contractId = $request->session()->get('selected_contract_id', 0);

        $resources = Resource::when($contractId > 0, fn ($query) => $query->where('contract_id', $contractId))
            ->with('resourceType')
            ->get();

        return response()->json($resources);
    }
}