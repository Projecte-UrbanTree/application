<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Sensor;
use Illuminate\Http\Request;

class SensorController extends Controller
{
    /**
     * Display a listing of the sensors.
     */
    public function index(Request $request)
    {
        try {
            $contractId = $request->session()->get('selected_contract_id', 0);

            $sensors = Sensor::when($contractId > 0, function ($query) use ($contractId) {
                return $query->where('contract_id', $contractId);
            })->get();

            return response()->json($sensors);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching sensors',
                'debug_message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Show the form for creating a new sensor.
     */
    public function create(Request $request)
    {
        $contractId = $request->session()->get('selected_contract_id', null);
        if ($contractId <= 0) {
            return response()->json(['message' => 'Debe seleccionar un contrato'], 400);
        }

        return response()->json(['message' => 'Ready to create sensor']);
    }

    /**
     * Store a newly created sensor in storage.
     */
    public function store(Request $request)
    {
        $contractId = $request->input('contract_id', $request->session()->get('selected_contract_id', null));

        if (empty($contractId) || $contractId <= 0) {
            return response()->json(['message' => 'Debe seleccionar un contrato'], 400);
        }

        try {
            $validated = $request->validate([
                'eui' => 'required|string|max:255|unique:sensors,eui',
                'name' => 'required|string|max:255',
                'longitude' => 'nullable|numeric',
                'latitude' => 'nullable|numeric',
            ]);

            $validated['contract_id'] = $contractId;

            $sensor = Sensor::create($validated);

            return response()->json($sensor, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'Error al crear el sensor',
                'error' => $th->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified sensor.
     */
    public function show(Sensor $sensor)
    {
        return response()->json($sensor);
    }

    /**
     * Show the form for editing the specified sensor.
     */
    public function edit(Sensor $sensor)
    {
        return response()->json(['sensor' => $sensor]);
    }

    /**
     * Update the specified sensor in storage.
     */
    public function update(Request $request, Sensor $sensor)
    {
        try {
            $validated = $request->validate([
                'eui' => 'required|string|max:255|unique:sensors,eui,'.$sensor->id,
                'name' => 'required|string|max:255',
                'longitude' => 'nullable|numeric',
                'latitude' => 'nullable|numeric',
                'contract_id' => 'required|exists:contracts,id',
            ]);

            $sensor->update($validated);

            return response()->json($sensor, 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'Error al actualizar el sensor',
                'error' => $th->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified sensor from storage.
     */
    public function destroy(Sensor $sensor)
    {
        try {
            $sensor->delete();

            return response()->json(['message' => 'Sensor eliminado'], 200);
        } catch (\Throwable $th) {
            return response()->json(['message' => 'Error al eliminar el sensor'], 500);
        }
    }
}
