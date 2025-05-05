<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Element;
use App\Models\ElementType;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ElementController extends Controller
{
    /**
     * Display a listing of elements.
     *
     * @return JsonResponse A JSON response containing the list of elements.
     */
    public function index(): JsonResponse
    {
        $elements = Element::all();

        return response()->json($elements);
    }

    /**
     * Store a newly created element in storage.
     *
     * @param  Request  $request  The HTTP request instance.
     * @return JsonResponse A JSON response containing the created element.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'description' => ['nullable', 'string', 'max:255'],
            'element_type_id' => ['required', 'integer'],
            'tree_type_id' => ['nullable', 'integer'],
            'point_id' => ['required', 'integer'],
        ]);

        $element = Element::create($validated);

        return response()->json($element, 201);
    }

    /**
     * Remove the specified element from storage.
     *
     * @param  int  $id  The ID of the element to delete.
     * @return JsonResponse A JSON response confirming the deletion or an error message.
     */
    public function destroy($id): JsonResponse
    {
        $element = Element::find($id);

        if (! $element) {
            return response()->json(['message' => 'Element not found'], 404);
        }

        $element->incidences()->delete();
        if ($element->eva) {
            $element->eva->delete();
        }

        $element->delete();

        return response()->json(['message' => 'Element deleted successfully'], 200);
    }

    /**
     * Update the specified element in storage.
     *
     * @param  Request  $request  The HTTP request instance.
     * @param  int  $id  The ID of the element to update.
     * @return JsonResponse A JSON response containing the updated element or an error message.
     */
    public function update(Request $request, $id): JsonResponse
    {
        // Validar los datos de entrada
        $validated = $request->validate([
            'description' => ['nullable', 'string', 'max:255'],
            'element_type_id' => ['required', 'integer'],
            'tree_type_id' => ['nullable', 'integer'],
            'point_id' => ['required', 'integer'],
        ]);

        // Check if the element type requires a tree type
        $elementType = ElementType::find($validated['element_type_id']);
        if ($elementType && ! $elementType->requires_tree_type) {
            $validated['tree_type_id'] = null; // Remove tree_type_id if not required
        }

        // Buscar el elemento por ID
        $element = Element::find($id);

        // Verificar si el elemento existe
        if (! $element) {
            return response()->json(['message' => 'Element not found'], 404);
        }

        // Actualizar el elemento con los datos validados
        $element->update($validated);

        // Devolver el elemento actualizado
        return response()->json($element, 200);
    }
}
