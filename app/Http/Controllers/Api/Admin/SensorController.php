<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Sensor;
use App\Models\SensorHistory;
use Illuminate\Http\Request;

class SensorController extends Controller
{
    public function index(Request $request)
    {
        $sensors = Sensor::orderBy('created_at', 'desc')->get();

        return response()->json($sensors, 200);
    }

    public function store(Request $request)
    {
        try {
            \Log::info('Request data:', $request->all()); // Afegim un log per veure les dades rebudes

            $validatedData = $request->validate([
                'dev_eui' => 'required|string|unique:sensors,dev_eui', // Assegura que el camp és únic
                'name' => 'required|string|max:255',
                'latitude' => 'required|numeric', // Eliminem restriccions de precisió
                'longitude' => 'required|numeric', // Eliminem restriccions de precisió
                'contract_id' => 'required|integer|exists:contracts,id', // Verifica que el contract_id existeix
            ]);

            // Crear el sensor
            $sensor = Sensor::create($validatedData);

            return response()->json($sensor, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(), // Retorna els errors de validació
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error creating sensor: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function show($id)
    {
        $sensor = Sensor::findOrFail($id); 
        return response()->json($sensor, 200);
    }

    public function update(Request $request, $id)
    {
        try {
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'latitude' => 'required|numeric|between:-90,90', // Eliminem restriccions de precisió
                'longitude' => 'required|numeric|between:-180,180', // Eliminem restriccions de precisió
                'contract_id' => 'required|integer|exists:contracts,id',
            ]);

            $sensor = Sensor::findOrFail($id);
            $sensor->update($validatedData);

            return response()->json($sensor, 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $sensor = Sensor::findOrFail($id);
            $sensor->delete();

            return response()->json(['message' => 'Sensor deleted successfully'], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function getSensorHistory(Request $request, $sensorId)
    {
        $range = $request->query('range');
        $startDate = $request->query('startDate');
        $endDate = $request->query('endDate');

        $query = SensorHistory::where('sensor_id', $sensorId);

        if ($range === 'week') {
            $query->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()]);
        } elseif ($range === 'month') {
            $query->whereBetween('created_at', [now()->startOfMonth(), now()->endOfMonth()]);
        } elseif ($range === 'custom' && $startDate && $endDate) {
            $query->whereBetween('created_at', [$startDate, $endDate]);
        }

        $sensorHistory = $query->select('created_at', 'phi_soil', 'water_soil', 'humidity')->get();

        // Agrupem les dades per dia
        $groupedData = $sensorHistory->groupBy(function ($item) {
            return $item->created_at->format('Y-m-d');
        });

        $labels = $groupedData->keys();
        $datasets = [
            [
                'label' => 'PH Terra',
                'data' => $groupedData->map(fn($day) => $day->avg('phi_soil') ?? 0)->values(),
            ],
            [
                'label' => 'Humitat Terra',
                'data' => $groupedData->map(fn($day) => $day->avg('water_soil') ?? 0)->values(),
            ],
        ];

        return response()->json([
            'labels' => $labels,
            'datasets' => $datasets,
        ], 200);
    }

    public function getSensorPH($sensorId)
    {
        $sensor = Sensor::findOrFail($sensorId);

        // Obtén el último valor de PH del historial del sensor
        $lastPH = SensorHistory::where('sensor_id', $sensorId)
            ->orderBy('created_at', 'desc')
            ->value('phi_soil');

        return response()->json(['ph' => $lastPH ?? 0], 200); // Devuelve 0 si no hay datos
    }

    public function getSensorPHByDevEui($dev_eui)
    {
        try {
            // Obtenim les dades de PH i Humitat del sensor amb el dev_eui especificat
            $sensorData = SensorHistory::whereHas('sensor', function ($query) use ($dev_eui) {
                $query->where('dev_eui', $dev_eui);
            })->select('created_at', 'phi_soil', 'water_soil')
              ->orderBy('created_at', 'asc')
              ->get();

            return response()->json($sensorData, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching sensor data: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function getAllSensorsHistory(Request $request)
    {
        $range = $request->query('range');
        $startDate = $request->query('startDate');
        $endDate = $request->query('endDate');

        $query = SensorHistory::query();

        if ($range === 'week') {
            $query->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()]);
        } elseif ($range === 'month') {
            $query->whereBetween('created_at', [now()->startOfMonth(), now()->endOfMonth()]);
        } elseif ($range === 'custom' && $startDate && $endDate) {
            $query->whereBetween('created_at', [$startDate, $endDate]);
        }

        // Inclou tots els camps necessaris
        $sensorHistories = $query->select('sensor_id', 'created_at', 'phi_soil', 'temp_soil', 'bat', 'water_soil')->get();

        return response()->json($sensorHistories, 200);
    }
}
