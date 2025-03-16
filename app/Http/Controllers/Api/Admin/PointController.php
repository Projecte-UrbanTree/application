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
        $request->validate([
            '*.latitude' => 'required|numeric',
            '*.longitude' => 'required|numeric',
            '*.type' => 'required|string|max:255',
            '*.zone_id' => 'required|integer|exists:zones,id',
        ]);

        $points = $request->all();

        if (!is_array($points) || count($points) < 1) {
            return response()->json(['error' => 'Se requiere un arreglo de puntos con al menos un elemento.'], 422);
        }

        $createdPoints = [];

        foreach ($points as $point) {
            $createdPoints[] = Point::create($point);
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
