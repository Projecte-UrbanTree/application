<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\WorkReport;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WorkReportController extends Controller
{
    /**
     * Display a listing of work reports.
     *
     * @return JsonResponse A JSON response containing the list of work reports.
     */
    public function index(): JsonResponse
    {
        $workReports = WorkReport::all();

        return response()->json($workReports, 200);
    }

    /**
     * Store a newly created work report in storage.
     *
     * @param Request $request The HTTP request instance.
     * @return JsonResponse A JSON response containing the created work report.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'observation' => ['nullable', 'string', 'max:255'],
            'spent_fuel' => ['required', 'numeric'],
            'work_order_id' => ['required', 'integer'],
            'report_status' => ['required', 'string', 'max:255'],
            'report_incidents' => ['required', 'string', 'max:255'],
        ]);

        $workReport = WorkReport::create($validated);

        return response()->json($workReport, 201);
    }

    /**
     * Display the specified work report.
     *
     * @param int $id The ID of the work report to retrieve.
     * @return JsonResponse A JSON response containing the work report details.
     */
    public function show($id): JsonResponse
    {
        $workReport = WorkReport::with([
            'workOrder',
            'workOrder.contract',
            'workOrder.workOrdersBlocks',
            'workOrder.workOrdersBlocks.zones',
            'workOrder.workOrdersBlocks.blockTasks.elementType',
            'workOrder.workOrdersBlocks.blockTasks.treeType',
            'workOrder.workOrdersBlocks.blockTasks.tasksType',
            'workOrder.users',
            'resources',
            'resources.resourceType',
        ])->find($id);

        if (!$workReport) {
            return response()->json(['message' => 'No se encontró el reporte de trabajo solicitado.'], 404);
        }

        return response()->json($workReport, 200);
    }

    /**
     * Update the specified work report in storage.
     *
     * @param Request $request The HTTP request instance.
     * @param int $id The ID of the work report to update.
     * @return JsonResponse A JSON response containing the updated work report.
     */
    public function update(Request $request, $id): JsonResponse
    {
        $workReport = WorkReport::findOrFail($id);

        $validated = $request->validate([
            'observation' => ['sometimes', 'string', 'max:255'],
            'spent_fuel' => ['sometimes', 'numeric'],
            'work_order_id' => ['sometimes', 'integer'],
            'report_status' => ['sometimes', 'string', 'max:255'],
            'report_incidents' => ['sometimes', 'string', 'max:255'],
        ]);

        $workReport->update($validated);

        $updatedReport = WorkReport::with([
            'workOrder',
            'workOrder.contract',
            'workOrder.workOrdersBlocks',
            'workOrder.workOrdersBlocks.zones',
            'workOrder.workOrdersBlocks.blockTasks.elementType',
            'workOrder.workOrdersBlocks.blockTasks.treeType',
            'workOrder.workOrdersBlocks.blockTasks.tasksType',
            'workOrder.users',
            'resources',
        ])->find($id);

        return response()->json($updatedReport, 200);
    }

    /**
     * Remove the specified work report from storage.
     *
     * @param int $id The ID of the work report to delete.
     * @return JsonResponse A JSON response confirming the deletion.
     */
    public function destroy($id): JsonResponse
    {
        $workReport = WorkReport::findOrFail($id);
        $workReport->delete();

        return response()->json(['message' => 'El reporte de trabajo ha sido eliminado correctamente.'], 200);
    }
}
