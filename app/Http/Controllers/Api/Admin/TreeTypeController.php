<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\TreeType;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TreeTypeController extends Controller
{
    /**
     * Display a listing of tree types.
     *
     * @return JsonResponse A JSON response containing the list of tree types.
     */
    public function index(): JsonResponse
    {
        $treeTypes = TreeType::all();

        return response()->json($treeTypes);
    }

    /**
     * Store a newly created tree type in storage.
     *
     * @param Request $request The HTTP request instance.
     * @return JsonResponse A JSON response containing the created tree type.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'family' => ['required', 'string', 'max:255'],
            'genus' => ['required', 'string', 'max:255'],
            'species' => ['nullable', 'string', 'max:255'],
        ]);

        $treeType = TreeType::create($validated);

        return response()->json($treeType, 201);
    }

    /**
     * Display the specified tree type.
     *
     * @param int $id The ID of the tree type to retrieve.
     * @return JsonResponse A JSON response containing the tree type details.
     */
    public function show($id): JsonResponse
    {
        $treeType = TreeType::findOrFail($id);

        return response()->json($treeType);
    }

    /**
     * Update the specified tree type in storage.
     *
     * @param Request $request The HTTP request instance.
     * @param int $id The ID of the tree type to update.
     * @return JsonResponse A JSON response containing the updated tree type.
     */
    public function update(Request $request, $id): JsonResponse
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

    /**
     * Remove the specified tree type from storage.
     *
     * @param int $id The ID of the tree type to delete.
     * @return JsonResponse A JSON response confirming the deletion.
     */
    public function destroy($id): JsonResponse
    {
        $treeType = TreeType::findOrFail($id);
        $treeType->delete();

        return response()->json(null, 204);
    }
}
