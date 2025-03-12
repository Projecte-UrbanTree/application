<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Eva;
use Illuminate\Http\Request;

class EvaController extends Controller
{
    public function index()
    {
        return response()->json(Eva::all());
    }

    public function show($id)
    {
        return response()->json(Eva::findOrFail($id));
    }

    public function store(Request $request)
    {
        $request->validate([
            'element_id' => 'nullable',
            'date_birth' => 'nullable',
            'height' => 'nullable',
            'diameter' => 'nullable',
            'crown_width' => 'nullable',
            'crown_projection_area' => 'nullable',
            'root_surface_diameter' => 'nullable',
            'effective_root_area' => 'nullable',
            'height_estimation' => 'nullable',
            'unbalanced_crown' => 'nullable',
            'overextended_branches' => 'nullable',
            'cracks' => 'nullable',
            'dead_branches' => 'nullable',
            'inclination' => 'nullable',
            'V_forks' => 'nullable',
            'cavities' => 'nullable',
            'bark_damage' => 'nullable',
            'soil_lifting' => 'nullable',
            'cut_damaged_roots' => 'nullable',
            'basal_rot' => 'nullable',
            'exposed_surface_roots' => 'nullable',
            'wind' => 'nullable',
            'drought' => 'nullable',
            'status' => 'nullable',
        ]);

        Eva::create($request->all());
        return response()->json(['message' => 'Eva created successfully']);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'element_id' => 'nullable',
            'date_birth' => 'nullable',
            'height' => 'nullable',
            'diameter' => 'nullable',
            'crown_width' => 'nullable',
            'crown_projection_area' => 'nullable',
            'root_surface_diameter' => 'nullable',
            'effective_root_area' => 'nullable',
            'height_estimation' => 'nullable',
            'unbalanced_crown' => 'nullable',
            'overextended_branches' => 'nullable',
            'cracks' => 'nullable',
            'dead_branches' => 'nullable',
            'inclination' => 'nullable',
            'V_forks' => 'nullable',
            'cavities' => 'nullable',
            'bark_damage' => 'nullable',
            'soil_lifting' => 'nullable',
            'cut_damaged_roots' => 'nullable',
            'basal_rot' => 'nullable',
            'exposed_surface_roots' => 'nullable',
            'wind' => 'nullable',
            'drought' => 'nullable',
            'status' => 'nullable',
        ]);

        Eva::findOrFail($id)->update($request->all());
        return response()->json(['message' => 'Eva updated successfully']);
    }

    public function destroy($id)
    {
        Eva::findOrFail($id)->delete();
        return response()->json(['message' => 'Eva deleted successfully']);
    }
}
