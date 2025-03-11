<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Eva;

class EvaController extends Controller
{
    public function index()
    {
        return response()->json(Eva::select('element_id', 'date_birth', 'height')->get());
    }
}
