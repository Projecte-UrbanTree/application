<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Sensor;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class SensorController extends Controller
{
    /**
     * Display a listing of the sensors.
     */
    public function index(Request $request)
    {
        try {
            $contractId = $request->session()->get('selected_contract_id', 0);
            $sensors = Sensor::when($contractId > 0, fn ($query) => $query->where('contract_id', $contractId))->get();

            return response()->json($sensors);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error fetching sensors', 'debug_message' => $e->getMessage()], 500);
        }
    }

    /**
     * Show the form for creating a new sensor.
     */
    public function create(Request $request)
    {
        $contractId = $request->session()->get('selected_contract_id', null);

        return $contractId <= 0
            ? response()->json(['message' => 'Debe seleccionar un contrato'], 400)
            : response()->json(['message' => 'Ready to create sensor']);
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
            return response()->json(['message' => 'Error de validación', 'errors' => $e->errors()], 422);
        } catch (\Throwable $th) {
            return response()->json(['message' => 'Error al crear el sensor', 'error' => $th->getMessage()], 500);
        }
    }

    /**
     * Display the specified sensor.
     */
    public function show($eui)
    {
        try {
            $response = Http::withHeaders(['X-API-Key' => env('VITE_X_API_KEY')])
                ->get("https://api-urbantree.alumnat.iesmontsia.org/sensors/{$eui}/history");

            return $response->successful()
                ? response()->json($response->json(), 200)
                : response()->json(['message' => 'Error fetching sensor details'], $response->status());
        } catch (\Throwable $th) {
            return response()->json(['message' => 'Error fetching sensor details', 'error' => $th->getMessage()], 500);
        }
    }

    /**
     * Show the form for editing the specified sensor.
     */
    public function edit($id)
    {
        try {
            return response()->json(['sensor' => Sensor::findOrFail($id)]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Sensor not found'], 404);
        }
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
            return response()->json(['message' => 'Error de validación', 'errors' => $e->errors()], 422);
        } catch (\Throwable $th) {
            return response()->json(['message' => 'Error al actualizar el sensor', 'error' => $th->getMessage()], 500);
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

    /**
     * Fetch all sensors from the external API.
     */
    public function fetchSensors()
    {
        try {
            $apiKey = env('VITE_X_API_KEY');
            if (empty($apiKey)) {
                throw new \Exception('API key not configured');
            }

            $response = Http::withoutVerifying()
                ->withHeaders(['X-API-Key' => $apiKey])
                ->get('https://api-urbantree.alumnat.iesmontsia.org/sensors');

            return $response->successful()
                ? response()->json($response->json())
                : response()->json(['message' => 'Error from external API'], $response->status());
        } catch (\Throwable $th) {
            return response()->json(['message' => 'Error fetching external sensors', 'error' => $th->getMessage()], 500);
        }
    }

    /**
     * Fetch a specific sensor by EUI from the external API.
     */
    public function fetchSensorByEUI($eui)
    {
        try {
            $response = Http::withoutVerifying()
                ->withHeaders(['X-API-Key' => env('VITE_X_API_KEY')])
                ->get("https://api-urbantree.alumnat.iesmontsia.org/sensors/deveui/{$eui}");

            return $response->successful()
                ? response()->json($response->json(), 200)
                : response()->json(['message' => 'Error fetching external sensor'], $response->status());
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Sensor not found'], 404);
        } catch (\Throwable $th) {
            return response()->json(['message' => 'Error fetching external sensor', 'error' => $th->getMessage()], 500);
        }
    }

    /**
     * Fetch all history sensor data by EUI with pagination.
     */
    public function fetchAllHistorySensorbyEUI($eui)
    {
        try {
            $response = Http::withoutVerifying()
                ->withHeaders(['X-API-Key' => env('VITE_X_API_KEY')])
                ->get("https://api-urbantree.alumnat.iesmontsia.org/sensors/deveui/{$eui}/history");

            if ($response->successful()) {
                $sensorData = $response->json();
                $page = request()->get('page', 1);
                $perPage = request()->get('perPage', 10);
                $offset = ($page - 1) * $perPage;

                return response()->json([
                    'data' => array_slice($sensorData, $offset, $perPage),
                    'total' => count($sensorData),
                    'page' => $page,
                    'perPage' => $perPage,
                ], 200);
            }

            return response()->json(['message' => 'Error fetching external sensor'], $response->status());
        } catch (\Throwable $th) {
            return response()->json(['message' => 'Error fetching external sensor', 'error' => $th->getMessage()], 500);
        }
    }
}
