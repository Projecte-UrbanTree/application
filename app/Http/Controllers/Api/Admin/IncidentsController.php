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

    public function store(Request $request)
    {
        $incidence = Incidence::create($request->all());
        return response()->json($incidence);
    }

    public function destroy(Request $request, $id)
    {
        $incidence = Incidence::find($id);
        $incidence->delete();
        return response()->json(null, 204);
    }
}
