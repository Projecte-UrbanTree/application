<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\TreeType;
use Illuminate\Http\Request;

class TreeTypeController extends Controller
{
    public function index()
    {
        $treeTypes = TreeType::all();

        return response()->json($treeTypes);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'family' => ['required', 'string', 'max:255'],
            'genus' => ['required', 'string', 'max:255'],
            'species' => ['nullable', 'string', 'max:255'],
        ]);
        $treeType = TreeType::create($validated);

        return response()->json($treeType, 201);
    }

    public function show($id)
    {
        $treeType = TreeType::findOrFail($id);

        return response()->json($treeType);
    }

    public function update(Request $request, $id)
    {
        $treeType = TreeType::findOrFail($id);
        $validated = $request->validate([
            'family' => ['sometimes', 'string', 'max:255'],
            'genus' => ['sometimes', 'string', 'max:255'],
            'species' => ['nullable', 'string', 'max:255'],
        ]);
        $treeType->update($validated);

        return response()->json($treeType);
    }

    public function destroy($id)
    {
        $treeType = TreeType::findOrFail($id);
        $treeType->delete();

        return response()->json(null, 204);
    }
}
