<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Zone;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ZoneController extends Controller
{
    /**
     * Display a listing of zones.
     *
     * @param Request $request The HTTP request instance.
     * @return JsonResponse A JSON response containing the list of zones.
     */
    public function index(Request $request): JsonResponse
    {
        $contractId = $request->header('X-Contract-Id');
        $zones = $contractId ? Zone::where('contract_id', $contractId)->get() : Zone::all();

        return response()->json($zones);
    }

    /**
     * Store a newly created zone in storage.
     *
     * @param Request $request The HTTP request instance.
     * @return JsonResponse A JSON response containing the created zone.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:255'],
            'color' => ['required', 'string', 'max:255'],
            'contract_id' => ['required', 'integer'],
        ]);

        $zone = Zone::create($validated);

        return response()->json($zone, 201);
    }

    /**
     * Remove the specified zone from storage.
     *
     * @param int $id The ID of the zone to delete.
     * @return JsonResponse A JSON response confirming the deletion.
     */
    public function destroy($id): JsonResponse
    {
        $zone = Zone::findOrFail($id);
        $zone->delete();

        return response()->json(['message' => 'Zona eliminada'], 200);
    }
}
