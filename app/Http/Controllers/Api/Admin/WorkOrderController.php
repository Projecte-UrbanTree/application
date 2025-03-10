<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\WorkOrder;
use Illuminate\Http\Request;

class WorkOrderController extends Controller
{
    public function index()
    {
        $workOrders = WorkOrder::with([
            'contract',
            'users',
            'workOrdersBlocks',
            'workOrdersBlocks.zones',
            'workOrdersBlocks.blockTasks.elementType',
            'workOrdersBlocks.blockTasks.treeType',
            'workOrdersBlocks.blockTasks.tasksType',
            'workReports',
        ])->get();

        return response()->json($workOrders);
    }

    public function create(Request $request)
    {
        $task_types = TaskType::all();
        $users = User::where('role', 1)->get();
        $zones = Zone::whereNotNull('name')->get();
        $tree_types = TreeType::all();
        $element_types = ElementType::all();
        return response()->json([
            'task_types' => $task_types,
            'users' => $users,
            'zones' => $zones,
            'tree_types' => $tree_types,
            'element_types' => $element_types
        ]);
    }


    public function destroy($id)
    {
        $workOrder = WorkOrder::findOrFail($id);
        $workOrder->delete();
        return response()->json(['message' => 'Work order deleted successfully']);
    }
}
