<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Point;
use Illuminate\Http\Request;

class PointController extends Controller
{
    public function index()
    {
        return Point::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'points' => ['required', 'array', 'min:1'],
            'points.*.latitude' => ['required', 'numeric'],
            'points.*.longitude' => ['required', 'numeric'],
            'points.*.type' => ['required', 'string', 'max:255'],
            'points.*.zone_id' => ['required', 'integer'],
        ]);

        $createdPoints = [];
        foreach ($validated['points'] as $pointData) {
            $createdPoints[] = Point::create($pointData);
        }

        return response()->json($createdPoints, 201);
    }

    public function destroy(Request $request, $id)
    {
        $points = Point::where('zone_id', $id);

        if ($points->count() === 0) {
            return response()->json([
                'message' => 'No se encontraron puntos para eliminar en esta zona.',
            ], 404);
        }

        $points->delete();

        return response()->json([
            'message' => 'Todos los puntos de la zona han sido eliminados correctamente.',
        ], 200);
    }
}
