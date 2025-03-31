<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Incidence;
use Illuminate\Http\Request;

class IncidentsController extends Controller
{
    public function index()
    {
        $incidences = Incidence::all();
        return response()->json($incidences);
    }
}
