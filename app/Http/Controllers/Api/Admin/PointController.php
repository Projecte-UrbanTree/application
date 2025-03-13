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
    $validate = $request->validate([
        'points' => ['required', 'array', 'min:1'], 
        'points.*.latitude' => ['required', 'numeric'], 
        'points.*.longitude' => ['required', 'numeric'],
        'points.*.type' => ['required', 'string', 'max:255'],
        'points.*.zone_id' => ['required', 'integer'],
    ]);

    $createdPoints = Point::insert($validate['points']);

    return response()->json(['message' => 'Puntos guardados correctamente'], 201);
}

}
