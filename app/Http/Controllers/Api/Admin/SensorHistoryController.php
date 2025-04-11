<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Sensor;
use App\Models\SensorHistory;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
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
            
            return response()->json($query->orderBy('created_at', 'desc')->paginate(15));
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
            return response()->json(['sensors' => Sensor::all(['id', 'name', 'eui'])]);
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

            return response()->json(SensorHistory::create($validated), 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Validation error', 'errors' => $e->errors()], 422);
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
            return response()->json(SensorHistory::with('sensor')->findOrFail($id));
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

            return response()->json(['sensorHistory' => $sensorHistory, 'sensors' => $sensors]);
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
            return response()->json(['message' => 'Validation error', 'errors' => $e->errors()], 422);
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
            SensorHistory::findOrFail($id)->delete();
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

            return response()->json(['sensor' => $sensor, 'history' => $history]);
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
            // Find the sensor by EUI
            $sensor = Sensor::where('eui', $eui)->firstOrFail();
            
            // Get timestamp of last fetched record
            $lastRecord = SensorHistory::where('sensor_id', $sensor->id)
                ->orderBy('created_at', 'desc')
                ->first();
            
            $lastFetchDate = $lastRecord ? $lastRecord->created_at->toIso8601String() : null;
            
            // Build API request URL
            $url = "http://api_urbantree.alumnat.iesmontsia.org/sensors/deveui/{$eui}/history";
            if ($lastFetchDate) {
                $url .= "?last_fetch_date=" . urlencode($lastFetchDate);
            }
            
            // Make API request
            $apiKey = env('VITE_X_API_KEY');
            if (empty($apiKey)) {
                throw new \Exception('API key not configured');
            }
            
            $response = Http::withHeaders(['X-API-Key' => $apiKey])->get($url);
            
            if (!$response->successful()) {
                return response()->json([
                    'message' => 'Error fetching data from external API',
                    'status' => $response->status(),
                ], $response->status());
            }
            
            // Process API response
            $responseData = $response->json();
            $recordsCreated = 0;
            $skippedRecords = 0;
            
            // Convert to array if response is a single object
            $sensorDataArray = is_array($responseData) && !array_key_exists('dev_eui', $responseData) 
                ? $responseData 
                : [$responseData];
            
            // Get existing timestamps to avoid duplicates
            $existingTimestamps = SensorHistory::where('sensor_id', $sensor->id)
                ->pluck('created_at')
                ->map(fn($timestamp) => $timestamp->toDateTimeString())
                ->toArray();
            
            $processedTimestamps = [];
            
            foreach ($sensorDataArray as $dataPoint) {
                // Skip records without timestamp
                if (empty($dataPoint['time'])) {
                    $skippedRecords++;
                    continue;
                }
                
                // Format timestamp and skip if already exists
                $dataTimestamp = Carbon::parse($dataPoint['time'])->toDateTimeString();
                if (in_array($dataTimestamp, $existingTimestamps) || in_array($dataTimestamp, $processedTimestamps)) {
                    $skippedRecords++;
                    continue;
                }
                
                $processedTimestamps[] = $dataTimestamp;
                
                // Create history record
                SensorHistory::create([
                    'sensor_id' => $sensor->id,
                    'temperature_soil' => $dataPoint['temp_soil'] ?? null,
                    'temperature_air' => $dataPoint['tempc_ds18b20'] ?? null,
                    'ph_soil' => $dataPoint['ph1_soil'] ?? null,
                    'humidity_soil' => $dataPoint['water_soil'] ?? null,
                    'conductivity_soil' => $dataPoint['conductor_soil'] ?? null,
                    'batery' => $dataPoint['bat'] ?? null,
                    'signal' => $dataPoint['rssi'] ?? null,
                    'created_at' => $dataTimestamp,
                ]);
                $recordsCreated++;
            }
            
            return response()->json([
                'message' => 'Successfully fetched and stored sensor data',
                'records_created' => $recordsCreated,
                'records_skipped' => $skippedRecords,
                'sensor_id' => $sensor->id,
                'eui' => $eui,
                'last_fetch_date' => $lastFetchDate,
                'total_records_processed' => count($sensorDataArray),
                'api_url_used' => $url
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
