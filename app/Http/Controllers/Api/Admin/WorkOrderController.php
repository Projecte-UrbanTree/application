<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Contract;
use App\Models\ElementType;
use App\Models\TaskType;
use App\Models\TreeType;
use App\Models\User;
use App\Models\WorkOrder;
use App\Models\WorkOrderBlock;
use App\Models\WorkOrderBlockTask;
use App\Models\Zone;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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
        $users = User::where('role', 'worker')->get();
        $zones = Zone::all();
        $tree_types = TreeType::all();
        $element_types = ElementType::all();
        $contracts = Contract::all();

        return response()->json([
            'task_types' => $task_types,
            'users' => $users,
            'zones' => $zones,
            'tree_types' => $tree_types,
            'element_types' => $element_types,
            'contracts' => $contracts,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'users' => 'required|array',
            'contract_id' => 'required|exists:contracts,id',
            'blocks' => 'required|array',
            'blocks.*.notes' => 'nullable|string',
            'blocks.*.zones' => 'nullable|array',
            'blocks.*.tasks' => 'array',
            'blocks.*.tasks.*.task_type_id' => 'required|exists:task_types,id',
            'blocks.*.tasks.*.element_type_id' => 'required|exists:element_types,id',
            'blocks.*.tasks.*.tree_type_id' => 'nullable|exists:tree_types,id',
        ]);

        try {
            // Start a database transaction
            DB::beginTransaction();
            
            // Create the work order
            $workOrder = WorkOrder::create([
                'date' => $validated['date'],
                'status' => 0, // Not started
                'contract_id' => $validated['contract_id'],
            ]);
            
            // Attach users to work order
            $workOrder->users()->attach($validated['users']);
            
            // Create blocks
            foreach ($validated['blocks'] as $blockData) {
                $block = new WorkOrderBlock([
                    'notes' => $blockData['notes'] ?? '',
                    'work_order_id' => $workOrder->id,
                ]);
                
                $block->save();
                
                // Attach zones to block if they exist
                if (!empty($blockData['zones'])) {
                    $zoneIds = collect($blockData['zones'])->pluck('id')->toArray();
                    $block->zones()->attach($zoneIds);
                }
                
                // Create tasks for this block
                if (!empty($blockData['tasks'])) {
                    foreach ($blockData['tasks'] as $taskData) {
                        // Create the block task
                        WorkOrderBlockTask::create([
                            'work_order_block_id' => $block->id,
                            'element_type_id' => $taskData['element_type_id'],
                            'task_type_id' => $taskData['task_type_id'],
                            'tree_type_id' => $taskData['tree_type_id'] ?? null,
                            'status' => 0, // Not started
                            'spent_time' => 0,
                        ]);
                    }
                }
            }
            
            // Commit transaction
            DB::commit();
            
            return response()->json([
                'message' => 'Work order created successfully',
                'work_order' => $workOrder->load([
                    'users', 
                    'workOrdersBlocks', 
                    'workOrdersBlocks.zones',
                    'workOrdersBlocks.blockTasks',
                    'workOrdersBlocks.blockTasks.elementType',
                    'workOrdersBlocks.blockTasks.tasksType',
                    'workOrdersBlocks.blockTasks.treeType',
                ]),
            ], 201);
        } catch (\Exception $e) {
            // Rollback in case of error
            DB::rollBack();
            
            return response()->json([
                'message' => 'Error creating work order',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        $workOrder = WorkOrder::findOrFail($id);
        $workOrder->delete();

        return response()->json(['message' => 'Work order deleted successfully']);
    }
}
