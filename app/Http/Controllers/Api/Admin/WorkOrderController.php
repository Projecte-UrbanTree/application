<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Contract;
use App\Models\ElementType;
use App\Models\TaskType;
use App\Models\TreeType;
use App\Models\WorkOrder;
use App\Models\WorkOrderBlock;
use App\Models\WorkOrderBlockTask;
use App\Models\Zone;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class WorkOrderController extends Controller
{
    /**
     * Display a listing of work orders.
     *
     * @return JsonResponse A JSON response containing the list of work orders.
     */
    public function index(): JsonResponse
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

    /**
     * Display data for creating a new work order.
     *
     * @param Request $request The HTTP request instance.
     * @return JsonResponse A JSON response containing data for creating a work order.
     */
    public function create(Request $request): JsonResponse
    {
        $contractId = $request->query('contract_id');
        $users = $contractId ? Contract::findOrFail($contractId)->workers()->where('role', 'worker')->get() : collect([]);
        $zones = $contractId ? Zone::select('id', 'name')->where('contract_id', $contractId)->get() : collect([]);

        return response()->json([
            'task_types' => TaskType::all(),
            'users' => $users,
            'zones' => $zones,
            'tree_types' => TreeType::all(),
            'element_types' => ElementType::all(),
            'contracts' => Contract::all(),
        ]);
    }

    /**
     * Store a newly created work order in storage.
     *
     * @param Request $request The HTTP request instance.
     * @return JsonResponse A JSON response containing the created work order.
     */
    public function store(Request $request): JsonResponse
    {
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

        try {
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

    /**
     * Display the specified work order.
     *
     * @param int $id The ID of the work order to retrieve.
     * @return JsonResponse A JSON response containing the work order details.
     */
    public function show($id): JsonResponse
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

        $availableWorkers = $workOrder->contract->workers()->where('role', 'worker')->get();
        $availableZones = Zone::where('contract_id', $workOrder->contract_id)->get();

        return response()->json([
            'id' => $workOrder->id,
            'date' => $workOrder->date,
            'status' => $workOrder->status,
            'contract_id' => $workOrder->contract_id,
            'users' => $workOrder->users,
            'work_orders_blocks' => $workOrder->workOrdersBlocks,
            'contract' => $workOrder->contract,
            'available_workers' => $availableWorkers,
            'available_zones' => $availableZones,
            'task_types' => TaskType::all(),
            'element_types' => ElementType::all(),
            'tree_types' => TreeType::all(),
        ]);
    }

    /**
     * Update the specified work order in storage.
     *
     * @param Request $request The HTTP request instance.
     * @param int $id The ID of the work order to update.
     * @return JsonResponse A JSON response containing the updated work order.
     */
    public function update(Request $request, $id): JsonResponse
    {
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

        try {
            $workOrder = WorkOrder::findOrFail($id);
            $workOrder->update(['date' => $validated['date']]);
            $workOrder->users()->sync($validated['users']);

            $oldBlockIds = $workOrder->workOrdersBlocks->pluck('id')->toArray();
            WorkOrderBlock::destroy($oldBlockIds);

            $this->saveBlocks($workOrder, $validated['blocks']);

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

    /**
     * Remove the specified work order from storage.
     *
     * @param int $id The ID of the work order to delete.
     * @return JsonResponse A JSON response confirming the deletion.
     */
    public function destroy($id): JsonResponse
    {
        $workOrder = WorkOrder::findOrFail($id);
        $workOrder->delete();

        return response()->json(['message' => 'Work order deleted successfully'], 200);
    }

    /**
     * Save blocks and their associated data for a work order.
     *
     * @param WorkOrder $workOrder The work order model instance.
     * @param array $blocks The array of blocks to save.
     * @return void
     */
    private function saveBlocks(WorkOrder $workOrder, array $blocks): void
    {
        foreach ($blocks as $blockData) {
            $block = WorkOrderBlock::create([
                'notes' => $blockData['notes'] ?? '',
                'work_order_id' => $workOrder->id,
            ]);

            $zoneIds = collect($blockData['zones'])->pluck('id')->filter()->values()->toArray();
            if (!empty($zoneIds)) {
                $block->zones()->attach($zoneIds);
            }

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
