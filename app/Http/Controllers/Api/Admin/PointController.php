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
            'latitude' => ['required', 'float', 'max:255'],
            'longitude' => ['required', 'float', 'max:255'],
            'type' => ['required', 'string', 'max:255'],
            'zone_id' => ['required', 'integer', 'max:255'],
        ]);
        $point = Point::create($validate);

        return response()->json($point, 201);
    }
}
