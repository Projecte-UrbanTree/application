<?php

namespace App\Http\Controllers\Api\Shared;

use App\Http\Controllers\Controller;
use App\Models\Contract;
use App\Models\ElementType;
use App\Models\TaskType;
use App\Models\TreeType;
use App\Models\WorkOrder;
use App\Models\WorkOrderBlock;
use App\Models\WorkOrderBlockTask;
use App\Models\WorkReport;
use App\Models\Zone;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class WorkOrderController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $contract = $user->selected_contract_id;

        // Check if the request is from a worker role
        if ($user->role === 'worker') {
            $date = $request->query('date', date('Y-m-d'));
            $workOrders = WorkOrder::filterByContract($contract)
                ->with([
                    'contract',
                    'users',
                    'workOrderBlocks',
                    'workOrderBlocks.zones',
                    'workOrderBlocks.workOrderBlockTasks.elementType',
                    'workOrderBlocks.workOrderBlockTasks.treeType',
                    'workOrderBlocks.workOrderBlockTasks.taskType',
                    'workReport',
                ])
                ->whereHas('users', function ($query) use ($user) {
                    $query->where('users.id', $user->id);
                });

            if ($date) {
                $workOrders->whereDate('date', $date);
            }
        } else {
            // For admin role, fetch all work orders
            $workOrders = WorkOrder::filterByContract($contract)
                ->with([
                    'contract',
                    'users',
                    'workOrderBlocks',
                    'workOrderBlocks.zones',
                    'workOrderBlocks.workOrderBlockTasks.elementType',
                    'workOrderBlocks.workOrderBlockTasks.treeType',
                    'workOrderBlocks.workOrderBlockTasks.taskType',
                    'workReport',
                ]);
        }

        return response()->json($workOrders->get());
    }

    public function create(Request $request)
    {
        $contract_id = $request->query('contract_id');

        if ($contract_id) {
            $contract = Contract::findOrFail($contract_id);
            $users = $contract->workers()->where('role', 'worker')->get();
            $zones = Zone::select('id', 'name')
                ->where('contract_id', $contract_id)
                ->get();
        } else {
            $users = collect([]);
            $zones = collect([]);
        }

        return response()->json([
            'task_types' => TaskType::all(),
            'users' => $users,
            'zones' => $zones,
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

            $this->saveBlocks($workOrder, $validated['blocks']);

            DB::commit();

            return response()->json([
                'message' => 'Work order created successfully',
                'work_order' => $workOrder->load([
                    'users',
                    'workOrderBlocks',
                    'workOrderBlocks.zones',
                    'workOrderBlocks.workOrderBlockTasks',
                    'workOrderBlocks.workOrderBlockTasks.elementType',
                    'workOrderBlocks.workOrderBlockTasks.taskType',
                    'workOrderBlocks.workOrderBlockTasks.treeType',
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
            'workOrderBlocks',
            'workOrderBlocks.zones',
            'workOrderBlocks.workOrderBlockTasks.elementType',
            'workOrderBlocks.workOrderBlockTasks.treeType',
            'workOrderBlocks.workOrderBlockTasks.taskType',
        ])->findOrFail($id);

        $availableWorkers = $workOrder->contract->workers()->where('role', 'worker')->get();

        $availableZones = Zone::where('contract_id', $workOrder->contract_id)->get();

        return response()->json([
            'id' => $workOrder->id,
            'date' => $workOrder->date,
            'status' => $workOrder->status,
            'contract_id' => $workOrder->contract_id,
            'users' => $workOrder->users,
            'work_orders_blocks' => $workOrder->workOrderBlocks,
            'contract' => $workOrder->contract,
            'available_workers' => $availableWorkers,
            'available_zones' => $availableZones,
            'task_types' => TaskType::all(),
            'element_types' => ElementType::all(),
            'tree_types' => TreeType::all(),
        ]);
    }

    public function edit(Request $request, $id)
    {
        $user = $request->user();
        $contract = $user->selected_contract_id;

        $workOrder = WorkOrder::with([
            'contract',
            'users',
            'workOrderBlocks',
            'workOrderBlocks.zones',
            'workOrderBlocks.workOrderBlockTasks.elementType',
            'workOrderBlocks.workOrderBlockTasks.treeType',
            'workOrderBlocks.workOrderBlockTasks.taskType',
        ])->findOrFail($id);

        return response()->json([
            'work_order' => $workOrder,
            'workers' => $workOrder->contract->workers()->get(),
            'zones' => Zone::filterByContract($contract)->get(),
            'task_types' => TaskType::all(),
            'element_types' => ElementType::all(),
            'tree_types' => TreeType::all(),
        ]);
    }

    public function update(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'date' => 'required|date',
                'users' => 'required|array',
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
            ]);

            $workOrder->users()->sync($validated['users']);

            $oldBlockIds = $workOrder->workOrderBlocks->pluck('id')->toArray();
            WorkOrderBlock::destroy($oldBlockIds);

            $this->saveBlocks($workOrder, $validated['blocks']);

            DB::commit();

            return response()->json([
                'message' => 'Work order updated successfully',
                'work_order' => $workOrder->fresh([
                    'users',
                    'workOrderBlocks',
                    'workOrderBlocks.zones',
                    'workOrderBlocks.workOrderBlockTasks',
                    'workOrderBlocks.workOrderBlockTasks.elementType',
                    'workOrderBlocks.workOrderBlockTasks.taskType',
                    'workOrderBlocks.workOrderBlockTasks.treeType',
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

    public function updateWorkReportStatus(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'status' => 'required|integer',
            ]);

            $workReport = WorkReport::findOrFail($id);
            $workReport->update(['report_status' => $validated['status']]);

            return response()->json(['message' => 'Work report status updated successfully']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error updating work report status'], 500);
        }
    }

    public function updateStatus(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'status' => 'required|integer',
            ]);

            $workOrder = WorkOrder::findOrFail($id);
            $workOrder->update(['status' => $validated['status']]);

            return response()->json(['message' => 'Work order status updated successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error updating work order status', 'error' => $e->getMessage()], 500);
        }
    }

    private function saveBlocks($workOrder, $blocks)
    {
        foreach ($blocks as $blockData) {
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
    }
}
