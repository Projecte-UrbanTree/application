<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\WorkReport;
use Illuminate\Http\Request;

class WorkReportController extends Controller
{
    public function index()
    {
        $workReports = WorkReport::all();

        return response()->json($workReports, 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'observation' => ['nullable', 'string', 'max:255'],
            'spent_fuel' => ['required', 'numeric'],
            'work_order_id' => ['required', 'integer'],
            'report_status' => ['required', 'string', 'max:255'],
            'report_incidents' => ['required', 'string', 'max:255'],
        ]);

        $createdWorkReport = WorkReport::create($validated);

        return response()->json($createdWorkReport, 201);
    }

    public function show($id)
    {
        $workReport = WorkReport::with(
            'workOrder',
            'workOrder.contract',
            'workOrder.workOrdersBlocks',
            'workOrder.workOrdersBlocks.zones',
            'workOrder.workOrdersBlocks.blockTasks',
            'workOrder.workOrdersBlocks.blockTasks.elementType',
            'workOrder.workOrdersBlocks.blockTasks.treeType',
            'workOrder.workOrdersBlocks.blockTasks.tasksType',
            'workOrder.users',
            'resources',
            'resources.resourceType',
        )->find($id);

        if ($workReport === null) {
            return response()->json([
                'message' => 'No se encontró el reporte de trabajo solicitado.',
            ], 404);
        }

        return response()->json($workReport, 200);
    }

    public function update(Request $request, $id)
    {
        $workReport = WorkReport::find($id);

        if ($workReport === null) {
            return response()->json([
                'message' => 'No se encontró el reporte de trabajo solicitado.',
            ], 404);
        }

        $validated = $request->validate([
            'observation' => ['sometimes', 'string', 'max:255'],
            'spent_fuel' => ['sometimes', 'numeric'],
            'work_order_id' => ['sometimes', 'integer'],
            'report_status' => ['sometimes', 'integer'],
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

    public function edit($id)
    {
        //
    }

    public function create()
    {
        //
    }

    public function destroy($id)
    {
        $workReport = WorkReport::find($id);

        if ($workReport === null) {
            return response()->json([
                'message' => 'No se encontró el reporte de trabajo solicitado.',
            ], 404);
        }

        $workReport->delete();

        return response()->json([
            'message' => 'El reporte de trabajo ha sido eliminado correctamente.',
        ], 200);
    }
}
