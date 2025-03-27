<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class SensorController extends Controller
{
    public function fetchSensors()
    {
        $response = Http::get('http://microservice-url/api/sensors');
        return response()->json($response->json(), $response->status());
    }

    public function fetchSensorHistory($id)
    {
        $response = Http::get("http://microservice-url/api/sensors/{$id}/history");
        return response()->json($response->json(), $response->status());
    }
}
