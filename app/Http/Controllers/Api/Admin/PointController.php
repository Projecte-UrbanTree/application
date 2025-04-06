<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Point;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PointController extends Controller
{
    /**
     * Display a listing of points.
     *
     * @return JsonResponse A JSON response containing the list of points.
     */
    public function index(): JsonResponse
    {
        $points = Point::all();

        return response()->json($points);
    }

    /**
     * Store newly created points in storage.
     *
     * @param  Request  $request  The HTTP request instance.
     * @return JsonResponse A JSON response containing the created points.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            '*.latitude' => ['required', 'numeric'],
            '*.longitude' => ['required', 'numeric'],
            '*.type' => ['required', 'string', 'max:255'],
            '*.zone_id' => ['required', 'integer'],
        ]);

        $createdPoints = collect($validated)->map(fn ($pointData) => Point::create($pointData));

        return response()->json($createdPoints, 201);
    }

    /**
     * Remove all points associated with a specific zone.
     *
     * @param  int  $id  The ID of the zone whose points should be deleted.
     * @return JsonResponse A JSON response confirming the deletion or an error message.
     */
    public function destroy($id): JsonResponse
    {
        $points = Point::where('zone_id', $id);

        if ($points->count() === 0) {
            return response()->json(['message' => 'No se encontraron puntos para eliminar en esta zona.'], 404);
        }

        $points->delete();

        return response()->json(['message' => 'Todos los puntos de la zona han sido eliminados correctamente.'], 200);
    }
}
