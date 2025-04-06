<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\TaskType;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TaskTypeController extends Controller
{
    /**
     * Display a listing of task types.
     *
     * @return JsonResponse A JSON response containing the list of task types.
     */
    public function index(): JsonResponse
    {
        $taskTypes = TaskType::all();

        return response()->json($taskTypes);
    }

    /**
     * Store a newly created task type in storage.
     *
     * @param  Request  $request  The HTTP request instance.
     * @return JsonResponse A JSON response containing the created task type.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        $taskType = TaskType::create($validated);

        return response()->json($taskType, 201);
    }

    /**
     * Display the specified task type.
     *
     * @param  int  $id  The ID of the task type to retrieve.
     * @return JsonResponse A JSON response containing the task type details.
     */
    public function show($id): JsonResponse
    {
        $taskType = TaskType::findOrFail($id);

        return response()->json($taskType);
    }

    /**
     * Update the specified task type in storage.
     *
     * @param  Request  $request  The HTTP request instance.
     * @param  int  $id  The ID of the task type to update.
     * @return JsonResponse A JSON response containing the updated task type.
     */
    public function update(Request $request, $id): JsonResponse
    {
        $taskType = TaskType::findOrFail($id);

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        $taskType->update($validated);

        return response()->json($taskType);
    }

    /**
     * Remove the specified task type from storage.
     *
     * @param  int  $id  The ID of the task type to delete.
     * @return JsonResponse A JSON response confirming the deletion.
     */
    public function destroy($id): JsonResponse
    {
        $taskType = TaskType::findOrFail($id);
        $taskType->delete();

        return response()->json(['message' => 'Tipus de tasca eliminat'], 200);
    }
}
