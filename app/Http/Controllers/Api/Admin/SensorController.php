<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Sensor;

class SensorController extends Controller
{
    /**
     * Display a listing of the sensors.
     */
    public function index()
    {
        $sensors = Sensor::all();
        return response()->json(['data' => $sensors], 200);
    }

    /**
     * Store a newly created sensor in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'eui' => 'required|string|max:255|unique:sensors,eui',
            'name' => 'required|string|max:255',
            'longitude' => 'nullable|numeric',
            'latitude' => 'nullable|numeric',
        ]);

        $sensor = Sensor::create($validatedData);
        return response()->json(['data' => $sensor], 201);
    }

    /**
     * Display the specified sensor.
     */
    public function show($id)
    {
        $sensor = Sensor::find($id);

        if (!$sensor) {
            return response()->json(['error' => 'Sensor not found'], 404);
        }

        return response()->json(['data' => $sensor], 200);
    }

    /**
     * Update the specified sensor in storage.
     */
    public function update(Request $request, $id)
    {
        $sensor = Sensor::find($id);

        if (!$sensor) {
            return response()->json(['error' => 'Sensor not found'], 404);
        }

        $validatedData = $request->validate([
            'eui' => 'sometimes|required|string|max:255|unique:sensors,eui,' . $id,
            'name' => 'sometimes|required|string|max:255',
            'longitude' => 'nullable|numeric',
            'latitude' => 'nullable|numeric',
        ]);

        $sensor->update($validatedData);
        return response()->json(['data' => $sensor], 200);
    }

    /**
     * Remove the specified sensor from storage.
     */
    public function destroy($id)
    {
        $sensor = Sensor::find($id);

        if (!$sensor) {
            return response()->json(['error' => 'Sensor not found'], 404);
        }

        $sensor->delete();
        return response()->json(['message' => 'Sensor deleted successfully'], 200);
    }
}