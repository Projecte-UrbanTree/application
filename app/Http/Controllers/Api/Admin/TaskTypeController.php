<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\TaskType;
use Illuminate\Http\Request;

class TaskTypeController extends Controller
{
    public function index()
    {
        return response()->json(TaskType::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        $taskType = TaskType::create($validated);

        return response()->json($taskType, 201);
    }

    public function show($id)
    {
        $taskType = TaskType::findOrFail($id);

        return response()->json($taskType);
    }

    public function update(Request $request, $id)
    {
        $taskType = TaskType::findOrFail($id);

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        $taskType->update($validated);

        return response()->json($taskType);
    }

    public function destroy($id)
    {
        $taskType = TaskType::findOrFail($id);
        $taskType->delete();

        return response()->json(['message' => 'Tipus de tasca eliminat'], 200);
    }
}
