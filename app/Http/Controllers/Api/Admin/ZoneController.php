<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Point;
use App\Models\Zone;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ZoneController extends Controller
{
    /**
     * Display a listing of zones.
     *
     * @param  Request  $request  The HTTP request instance.
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
     * @param  Request  $request  The HTTP request instance.
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
     * Update the specified zone in storage.
     *
     * @param  Request  $request  The HTTP request instance.
     * @param  int  $id  The ID of the zone to update.
     * @return JsonResponse A JSON response containing the updated zone.
     */
    public function update(Request $request, $id): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:255'],
            'color' => ['required', 'string', 'max:255'],
        ]);

        $zone = Zone::findOrFail($id);
        $zone->update($validated);

        return response()->json($zone);
    }

    /**
     * Inline update for zone name or description.
     *
     * @param  Request  $request  The HTTP request instance.
     * @param  int  $id  The ID of the zone to update.
     * @return JsonResponse A JSON response containing the updated zone.
     */
    public function inlineUpdate(Request $request, $id): JsonResponse
    {
        $validated = $request->validate([
            'field' => ['required', 'string', 'in:name,description'],
            'value' => ['required', 'string', 'max:255'],
        ]);

        $zone = Zone::findOrFail($id);
        $zone->update([$validated['field'] => $validated['value']]);

        return response()->json($zone);
    }

    /**
     * Remove the specified zone from storage.
     *
     * @param  int  $id  The ID of the zone to delete.
     * @return JsonResponse A JSON response confirming the deletion.
     */
    public function destroy($id): JsonResponse
    {
        $zone = Zone::findOrFail($id);
        $zone->delete();

        return response()->json(['message' => 'Zona eliminada'], 200);
    }

    public function getCenterZoom(Request $request, $id): JsonResponse
    {
        $contractId = $request->header('X-Contract-Id');

        $zone = Zone::where('contract_id', $contractId)->where('id', $id)->first();
        if (! $zone) {
            return response()->json([], 200);
        }

        $points = Point::where('zone_id', $id)
            ->where('type', 'zone_delimiter')
            ->get();

        if ($points->isEmpty()) {
            return response()->json([], 200);
        }

        $latitudes = [];
        $longitudes = [];

        foreach ($points as $point) {
            $latitudes[] = $point->latitude;
            $longitudes[] = $point->longitude;
        }

        $center_lat = array_sum($latitudes) / count($latitudes);
        $center_lng = array_sum($longitudes) / count($longitudes);

        $minLat = min($latitudes);
        $maxLat = max($latitudes);
        $minLng = min($longitudes);
        $maxLng = max($longitudes);
        $latDiff = abs($maxLat - $minLat);
        $lngDiff = abs($maxLng - $minLng);
        $maxDiff = max($latDiff, $lngDiff);

        $zoom = 12;
        if ($maxDiff < 0.001) {
            $zoom = 18;
        } elseif ($maxDiff < 0.005) {
            $zoom = 17;
        } elseif ($maxDiff < 0.01) {
            $zoom = 16;
        } elseif ($maxDiff < 0.05) {
            $zoom = 15;
        } elseif ($maxDiff < 0.1) {
            $zoom = 14;
        } elseif ($maxDiff < 0.5) {
            $zoom = 13;
        } else {
            $zoom = 12;
        }

        return response()->json([
            'center' => [$center_lng, $center_lat],
            'zoom' => $zoom,
        ]);
    }
}
