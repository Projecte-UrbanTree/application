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
        return response()->json([
            'task_types' => TaskType::all(),
            'users' => User::where('role', 'worker')->get(),
            'zones' => Zone::all(),
            'tree_types' => TreeType::all(),
            'element_types' => ElementType::all(),
            'contracts' => Contract::all(),
        ]);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'date' => 'required|date',
                'users' => 'required|array',
                'contract_id' => 'required|exists:contracts,id',
                'blocks' => 'required|array',
                'blocks.*.notes' => 'nullable|string',
                'blocks.*.zones' => 'required|array',
                'blocks.*.tasks' => 'required|array',
                'blocks.*.tasks.*.task_type_id' => 'required|exists:task_types,id',
                'blocks.*.tasks.*.element_type_id' => 'required|exists:element_types,id',
                'blocks.*.tasks.*.tree_type_id' => 'nullable|exists:tree_types,id',
            ]);

            DB::beginTransaction();

            $workOrder = WorkOrder::create([
                'date' => $validated['date'],
                'status' => 0,
                'contract_id' => $validated['contract_id'],
            ]);

            $workOrder->users()->attach($validated['users']);

            foreach ($validated['blocks'] as $blockData) {
                $block = new WorkOrderBlock([
                    'notes' => $blockData['notes'] ?? '',
                    'work_order_id' => $workOrder->id,
                ]);
                $block->save();

                if (!empty($blockData['zones']) && is_array($blockData['zones'])) {
                    $zoneIds = is_array($blockData['zones'][0])
                        ? collect($blockData['zones'])->pluck('id')->filter()->values()->toArray()
                        : array_filter($blockData['zones']);
                    if (!empty($zoneIds)) {
                        $block->zones()->attach($zoneIds);
                    }
                }

                if (!empty($blockData['tasks'])) {
                    foreach ($blockData['tasks'] as $taskData) {
                        WorkOrderBlockTask::create([
                            'work_order_block_id' => $block->id,
                            'element_type_id' => $taskData['element_type_id'],
                            'task_type_id' => $taskData['task_type_id'],
                            'tree_type_id' => $taskData['tree_type_id'] ?? null,
                            'status' => 0,
                            'spent_time' => 0,
                        ]);
                    }
                }
            }

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
            DB::rollBack();
            return response()->json(['message' => 'Error creating work order'], 500);
        }
    }

    public function show($id)
    {
        $workOrder = WorkOrder::with([
            'contract',
            'users',
            'workOrdersBlocks',
            'workOrdersBlocks.zones',
            'workOrdersBlocks.blockTasks.elementType',
            'workOrdersBlocks.blockTasks.treeType',
            'workOrdersBlocks.blockTasks.tasksType',
        ])->findOrFail($id);

        return response()->json($workOrder);
    }

    public function update(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'date' => 'required|date',
                'users' => 'required|array',
                'contract_id' => 'required|exists:contracts,id',
                'blocks' => 'required|array',
                'blocks.*.notes' => 'nullable|string',
                'blocks.*.zones' => 'required|array',
                'blocks.*.tasks' => 'required|array',
                'blocks.*.tasks.*.task_type_id' => 'required|exists:task_types,id',
                'blocks.*.tasks.*.element_type_id' => 'required|exists:element_types,id',
                'blocks.*.tasks.*.tree_type_id' => 'nullable|exists:tree_types,id',
            ]);

            DB::beginTransaction();

            $workOrder = WorkOrder::findOrFail($id);
            $workOrder->update([
                'date' => $validated['date'],
                'contract_id' => $validated['contract_id'],
            ]);

            $workOrder->users()->sync($validated['users']);

            $oldBlockIds = $workOrder->workOrdersBlocks->pluck('id')->toArray();
            WorkOrderBlock::destroy($oldBlockIds);

            foreach ($validated['blocks'] as $blockData) {
                $block = new WorkOrderBlock([
                    'notes' => $blockData['notes'] ?? '',
                    'work_order_id' => $workOrder->id,
                ]);
                $block->save();

                if (!empty($blockData['zones']) && is_array($blockData['zones'])) {
                    $zoneIds = is_array($blockData['zones'][0])
                        ? collect($blockData['zones'])->pluck('id')->filter()->values()->toArray()
                        : array_filter($blockData['zones']);
                    if (!empty($zoneIds)) {
                        $block->zones()->attach($zoneIds);
                    }
                }

                if (!empty($blockData['tasks'])) {
                    foreach ($blockData['tasks'] as $taskData) {
                        WorkOrderBlockTask::create([
                            'work_order_block_id' => $block->id,
                            'element_type_id' => $taskData['element_type_id'],
                            'task_type_id' => $taskData['task_type_id'],
                            'tree_type_id' => $taskData['tree_type_id'] ?? null,
                            'status' => 0,
                            'spent_time' => 0,
                        ]);
                    }
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Work order updated successfully',
                'work_order' => $workOrder->fresh([
                    'users',
                    'workOrdersBlocks',
                    'workOrdersBlocks.zones',
                    'workOrdersBlocks.blockTasks',
                    'workOrdersBlocks.blockTasks.elementType',
                    'workOrdersBlocks.blockTasks.tasksType',
                    'workOrdersBlocks.blockTasks.treeType',
                ]),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error updating work order'], 500);
        }
    }

    public function destroy($id)
    {
        $workOrder = WorkOrder::findOrFail($id);
        $workOrder->delete();
        return response()->json(['message' => 'Work order deleted successfully']);
    }
}
