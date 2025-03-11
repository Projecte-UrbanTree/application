<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Point;

class PointController extends Controller
{
    public function index()
    {
        return Point::all();
    }
}
