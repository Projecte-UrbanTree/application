<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Incidence;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class IncidentsController extends Controller
{
    /**
     * Display a listing of incidences.
     *
     * @return JsonResponse A JSON response containing the list of incidences.
     */
    public function index(): JsonResponse
    {
        $incidences = Incidence::all();

        return response()->json($incidences);
    }

    /**
     * Store a newly created incidence in storage.
     *
     * @param Request $request The HTTP request instance.
     * @return JsonResponse A JSON response containing the created incidence.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'description' => ['required', 'string', 'max:255'],
            'type' => ['required', 'string', 'max:255'],
            'status' => ['required', 'string', 'max:255'],
        ]);

        $incidence = Incidence::create($validated);

        return response()->json($incidence, 201);
    }

    /**
     * Update the specified incidence in storage.
     *
     * @param Request $request The HTTP request instance.
     * @param int $id The ID of the incidence to update.
     * @return JsonResponse A JSON response containing the updated incidence.
     */
    public function update(Request $request, $id): JsonResponse
    {
        $incidence = Incidence::findOrFail($id);

        $validated = $request->validate([
            'description' => ['sometimes', 'string', 'max:255'],
            'type' => ['sometimes', 'string', 'max:255'],
            'status' => ['sometimes', 'string', 'max:255'],
        ]);

        $incidence->update($validated);

        return response()->json($incidence, 200);
    }

    /**
     * Remove the specified incidence from storage.
     *
     * @param int $id The ID of the incidence to delete.
     * @return JsonResponse A JSON response confirming the deletion.
     */
    public function destroy($id): JsonResponse
    {
        $incidence = Incidence::findOrFail($id);
        $incidence->delete();

        return response()->json(null, 204);
    }
}
