<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SensorHistory;
use App\Models\Sensor;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Http;

class SensorHistoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $sensorId = $request->input('sensor_id');
            
            $query = SensorHistory::with('sensor');
            
            if ($sensorId) {
                $query->where('sensor_id', $sensorId);
            }
            
            $history = $query->orderBy('created_at', 'desc')->paginate(15);
            
            return response()->json($history);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching sensor history',
                'debug_message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        try {
            $sensors = Sensor::all(['id', 'name', 'eui']);
            return response()->json(['sensors' => $sensors]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error preparing sensor history form',
                'debug_message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'sensor_id' => 'required|exists:sensors,id',
                'temperature_soil' => 'nullable|numeric',
                'temperature_air' => 'nullable|numeric',
                'ph_soil' => 'nullable|numeric',
                'humidity_soil' => 'nullable|numeric',
                'conductivity_soil' => 'nullable|numeric',
                'batery' => 'nullable|numeric',
                'signal' => 'nullable|numeric',
            ]);

            $sensorHistory = SensorHistory::create($validated);
            
            return response()->json($sensorHistory, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error creating sensor history record',
                'debug_message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $sensorHistory = SensorHistory::with('sensor')->findOrFail($id);
            return response()->json($sensorHistory);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Sensor history record not found'], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching sensor history record',
                'debug_message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        try {
            $sensorHistory = SensorHistory::findOrFail($id);
            $sensors = Sensor::all(['id', 'name', 'eui']);
            
            return response()->json([
                'sensorHistory' => $sensorHistory,
                'sensors' => $sensors
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Sensor history record not found'], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching sensor history record for editing',
                'debug_message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            $sensorHistory = SensorHistory::findOrFail($id);
            
            $validated = $request->validate([
                'sensor_id' => 'required|exists:sensors,id',
                'temperature_soil' => 'nullable|numeric',
                'temperature_air' => 'nullable|numeric',
                'ph_soil' => 'nullable|numeric',
                'humidity_soil' => 'nullable|numeric',
                'conductivity_soil' => 'nullable|numeric',
                'batery' => 'nullable|numeric',
                'signal' => 'nullable|numeric',
            ]);

            $sensorHistory->update($validated);
            
            return response()->json($sensorHistory);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Sensor history record not found'], 404);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error updating sensor history record',
                'debug_message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $sensorHistory = SensorHistory::findOrFail($id);
            $sensorHistory->delete();
            
            return response()->json(['message' => 'Sensor history record deleted successfully']);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Sensor history record not found'], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error deleting sensor history record',
                'debug_message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get history records for a specific sensor.
     */
    public function getBySensor($sensorId)
    {
        try {
            $sensor = Sensor::findOrFail($sensorId);
            $history = SensorHistory::where('sensor_id', $sensorId)
                ->orderBy('created_at', 'desc')
                ->paginate(15);
                
            return response()->json([
                'sensor' => $sensor,
                'history' => $history
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Sensor not found'], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching sensor history records',
                'debug_message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Fetch and store sensor data from external API by EUI.
     */
    public function fetchAndStoreSensorData($eui)
    {
        try {
            $sensor = Sensor::where('eui', $eui)->firstOrFail();
            
            $apiKey = env('VITE_X_API_KEY');
            if (empty($apiKey)) {
                throw new \Exception('API key not configured');
            }

            $response = Http::withHeaders([
                'X-API-Key' => $apiKey,
            ])->get("http://api_urbantree.alumnat.iesmontsia.org/sensors/deveui/{$eui}/history");

            if (!$response->successful()) {
                return response()->json([
                    'message' => 'Error fetching data from external API',
                    'status' => $response->status()
                ], $response->status());
            }

            $responseData = $response->json();
            $recordsCreated = 0;

            $sensorDataArray = is_array($responseData) && !array_key_exists('dev_eui', $responseData) ? $responseData : [$responseData];
            
            foreach ($sensorDataArray as $dataPoint) {
                if (isset($dataPoint['dev_eui']) && $dataPoint['dev_eui'] !== $eui) {
                    continue; 
                }
                
                $historyData = [
                    'sensor_id' => $sensor->id, 
                    'temperature_soil' => $dataPoint['temp_soil'] ?? null,
                    'temperature_air' => $dataPoint['tempc_ds18b20'] ?? null,
                    'ph_soil' => $dataPoint['ph1_soil'] ?? null,
                    'humidity_soil' => $dataPoint['water_soil'] ?? null,
                    'conductivity_soil' => $dataPoint['conductor_soil'] ?? null,
                    'batery' => $dataPoint['bat'] ?? null,
                    'signal' => $dataPoint['rssi'] ?? null,
                ];

                SensorHistory::create($historyData);
                $recordsCreated++;
            }

            return response()->json([
                'message' => "Successfully fetched and stored sensor data",
                'records_created' => $recordsCreated,
                'sensor_id' => $sensor->id,
                'eui' => $eui
            ]);
            
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Sensor not found'], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching and storing sensor data',
                'debug_message' => $e->getMessage(),
            ], 500);
        }
    }
}
