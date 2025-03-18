<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Sensor;
use Illuminate\Http\Request;

class SensorController extends Controller
{
    public function index()
    {
        $sensors = Sensor::select('id', 'device_eui', 'name', 'latitude', 'longitude', 'contract_id')->get(); 
        return response()->json($sensors, 200); 
    }
    
    public function store(Request $request)
    {
        $request->validate([
            'device_eui' => 'required|string|unique:sensors',
            'name' => 'required|string',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'contract_id' => 'required|integer|exists:contracts,id',
        ]);

        $sensor = Sensor::create($request->all());

        return response()->json($sensor->fresh(), 201); 
    }

    public function show($id)
    {
        $sensor = Sensor::findOrFail($id); // Retorna un error 404 si no troba el sensor
        return response()->json($sensor, 200); // Retorna les dades del sensor
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'device_eui' => 'required|string|unique:sensors,device_eui,' . $id,
            'name' => 'required|string',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'contract_id' => 'required|integer|exists:contracts,id',
        ]);

        $sensor = Sensor::findOrFail($id);
        $sensor->update($request->all());

        return response()->json($sensor);
    }

    public function destroy($id)
    {
        Sensor::destroy($id);

        return response()->json(null, 204);
    }
}
