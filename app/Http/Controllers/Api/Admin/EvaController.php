<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Element;
use App\Models\Eva;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;

class EvaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse A JSON response containing the list of EVAs.
     */
    public function index(): JsonResponse
    {
        $evas = Eva::with(['element.point', 'element.elementType'])->get();

        return response()->json($evas);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return JsonResponse A JSON response containing data for creating an EVA.
     */
    public function create(): JsonResponse
    {
        $dictionaries = Config::get('dictionaries');
        $elements = Element::with(['elementType'])->get()->map(fn ($element) => [
            'id' => $element->id,
            'name' => $element->elementType->name,
        ]);

        return response()->json([
            'dictionaries' => $dictionaries,
            'elements' => $elements,
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id  The ID of the EVA to retrieve.
     * @return JsonResponse A JSON response containing the EVA details.
     */
    public function show(int $id): JsonResponse
    {
        $eva = Eva::with(['element.point', 'element.elementType'])->findOrFail($id);

        return response()->json($eva);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  Request  $request  The HTTP request instance.
     * @return JsonResponse A JSON response containing the created EVA.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'element_id' => ['required', 'integer', 'exists:elements,id'],
            'date_birth' => ['required', 'date'],
            'height' => ['nullable', 'numeric'],
            'diameter' => ['nullable', 'numeric'],
            'crown_width' => ['nullable', 'numeric'],
            'crown_projection_area' => ['nullable', 'numeric'],
            'root_surface_diameter' => ['nullable', 'numeric'],
            'effective_root_area' => ['nullable', 'numeric'],
            'height_estimation' => ['nullable', 'numeric'],
            'unbalanced_crown' => ['nullable', 'integer'],
            'overextended_branches' => ['nullable', 'integer'],
            'cracks' => ['nullable', 'integer'],
            'dead_branches' => ['nullable', 'integer'],
            'inclination' => ['nullable', 'integer'],
            'V_forks' => ['nullable', 'integer'],
            'cavities' => ['nullable', 'integer'],
            'bark_damage' => ['nullable', 'integer'],
            'soil_lifting' => ['nullable', 'integer'],
            'cut_damaged_roots' => ['nullable', 'integer'],
            'basal_rot' => ['nullable', 'integer'],
            'exposed_surface_roots' => ['nullable', 'integer'],
            'wind' => ['nullable', 'integer'],
            'drought' => ['nullable', 'integer'],
            'status' => ['nullable', 'integer'],
        ]);

        $eva = Eva::create($validated);

        return response()->json([
            'message' => 'Eva created successfully',
            'eva' => $eva,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id  The ID of the EVA to edit.
     * @return JsonResponse A JSON response containing data for editing the EVA.
     */
    public function edit(int $id): JsonResponse
    {
        $eva = Eva::with(['element.point', 'element.elementType'])->findOrFail($id);

        if (! $eva) {
            return response()->json([]);
        }

        return response()->json([
            'dictionaries' => Config::get('dictionaries'),
            'eva' => $eva,
            'status' => 'success',
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  Request  $request  The HTTP request instance.
     * @param  int  $id  The ID of the EVA to update.
     * @return JsonResponse A JSON response confirming the update.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'element_id' => ['required', 'integer', 'exists:elements,id'],
            'date_birth' => ['nullable', 'date'],
            'height' => ['nullable', 'numeric'],
            'diameter' => ['nullable', 'numeric'],
            'crown_width' => ['nullable', 'numeric'],
            'crown_projection_area' => ['nullable', 'numeric'],
            'root_surface_diameter' => ['nullable', 'numeric'],
            'effective_root_area' => ['nullable', 'numeric'],
            'height_estimation' => ['nullable', 'numeric'],
            'unbalanced_crown' => ['nullable', 'integer'],
            'overextended_branches' => ['nullable', 'integer'],
            'cracks' => ['nullable', 'integer'],
            'dead_branches' => ['nullable', 'integer'],
            'inclination' => ['nullable', 'integer'],
            'V_forks' => ['nullable', 'integer'],
            'cavities' => ['nullable', 'integer'],
            'bark_damage' => ['nullable', 'integer'],
            'soil_lifting' => ['nullable', 'integer'],
            'cut_damaged_roots' => ['nullable', 'integer'],
            'basal_rot' => ['nullable', 'integer'],
            'exposed_surface_roots' => ['nullable', 'integer'],
            'wind' => ['nullable', 'integer'],
            'drought' => ['nullable', 'integer'],
            'status' => ['nullable', 'integer'],
        ]);

        $eva = Eva::findOrFail($id);
        $eva->update($validated);

        return response()->json(['message' => 'Eva updated successfully', 'eva' => $eva]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id  The ID of the EVA to delete.
     * @return JsonResponse A JSON response confirming the deletion.
     */
    public function destroy(int $id): JsonResponse
    {
        Eva::findOrFail($id)->delete();

        return response()->json(['message' => 'Eva deleted successfully']);
    }

    /**
     * Get EVA by element ID.
     *
     * @param  int  $elementId  The ID of the element to retrieve the EVA for.
     * @return JsonResponse A JSON response containing the EVA details or an error message.
     */
    public function getByElementId(int $elementId): JsonResponse
    {
        $eva = Eva::with(['element.point', 'element.elementType'])
            ->where('element_id', $elementId)
            ->first();

        if (! $eva) {
            return response()->json(['message' => 'No EVA found for this element'], 404);
        }

        return response()->json($eva);
    }
}
