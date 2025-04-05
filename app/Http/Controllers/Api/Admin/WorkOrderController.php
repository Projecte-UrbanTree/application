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
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class WorkOrderController extends Controller
{
    const STATUS_NOT_STARTED = 0;
    const STATUS_IN_PROGRESS = 1;
    const STATUS_COMPLETED = 2;
    const STATUS_REPORT_SENT = 3;

    /**
     * Display a listing of work orders.
     *
     * @return JsonResponse A JSON response containing the list of work orders.
     */
    public function index(): JsonResponse
    {
        try {
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
        } catch (\Exception $e) {
            Log::error('Error fetching work orders: ' . $e->getMessage());
            return response()->json(['message' => 'Error fetching work orders'], 500);
        }
    }

    /**
     * Display data for creating a new work order.
     *
     * @param Request $request The HTTP request instance.
     * @return JsonResponse A JSON response containing data for creating a work order.
     */
    public function create(Request $request): JsonResponse
    {
        try {
            $contractId = $request->query('contract_id');
            
            $data = [
                'task_types' => TaskType::all(),
                'tree_types' => TreeType::all(),
                'element_types' => ElementType::all(),
                'contracts' => Contract::all(),
            ];
            
            if ($contractId) {
                $contract = Contract::findOrFail($contractId);
                $data['users'] = $contract->workers()->where('role', 'worker')->get();
                $data['zones'] = Zone::select('id', 'name')->where('contract_id', $contractId)->get();
                $data['current_contract'] = $contract;
            } else {
                $data['users'] = [];
                $data['zones'] = [];
            }

            return response()->json($data);
        } catch (\Exception $e) {
            Log::error('Error preparing work order creation data: ' . $e->getMessage());
            return response()->json(['message' => 'Error preparing creation data'], 500);
        }
    }

    /**
     * Store a newly created work order in storage.
     *
     * @param Request $request The HTTP request instance.
     * @return JsonResponse A JSON response containing the created work order.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'date' => 'required|date',
                'users' => 'required|array',
                'users.*' => 'exists:users,id',
                'contract_id' => 'required|exists:contracts,id',
                'blocks' => 'required|array',
                'blocks.*.notes' => 'nullable|string',
                'blocks.*.zones' => 'required|array',
                'blocks.*.zones.*' => 'exists:zones,id',
                'blocks.*.tasks' => 'required|array',
                'blocks.*.tasks.*.task_type_id' => 'required|exists:task_types,id',
                'blocks.*.tasks.*.element_type_id' => 'required|exists:element_types,id',
                'blocks.*.tasks.*.tree_type_id' => 'nullable|exists:tree_types,id',
            ]);

            DB::beginTransaction();

            $workOrder = WorkOrder::create([
                'date' => $validated['date'],
                'status' => self::STATUS_NOT_STARTED,
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
        } catch (ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Validation error',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error creating work order: ' . $e->getMessage());
            return response()->json(['message' => 'Error creating work order: ' . $e->getMessage()], 500);
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
        try {
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
        } catch (\Exception $e) {
            Log::error('Error fetching work order: ' . $e->getMessage());
            return response()->json(['message' => 'Error fetching work order details'], 500);
        }
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
        try {
            $workOrder = WorkOrder::findOrFail($id);
            
            if ($workOrder->status > self::STATUS_NOT_STARTED) {
                return response()->json([
                    'message' => 'Cannot edit a work order that is already in progress or completed'
                ], 422);
            }
            
            $validated = $request->validate([
                'date' => 'required|date',
                'users' => 'required|array',
                'users.*' => 'exists:users,id',
                'blocks' => 'required|array',
                'blocks.*.notes' => 'nullable|string',
                'blocks.*.zones' => 'required|array',
                'blocks.*.zones.*' => 'exists:zones,id',
                'blocks.*.tasks' => 'required|array',
                'blocks.*.tasks.*.task_type_id' => 'required|exists:task_types,id',
                'blocks.*.tasks.*.element_type_id' => 'required|exists:element_types,id',
                'blocks.*.tasks.*.tree_type_id' => 'nullable|exists:tree_types,id',
            ]);

            DB::beginTransaction();

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
        } catch (ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Validation error',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error updating work order: ' . $e->getMessage());
            return response()->json(['message' => 'Error updating work order: ' . $e->getMessage()], 500);
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
        try {
            $workOrder = WorkOrder::findOrFail($id);
            
            if ($workOrder->status > self::STATUS_NOT_STARTED) {
                return response()->json([
                    'message' => 'Cannot delete a work order that is already in progress or completed'
                ], 422);
            }
            
            if ($workOrder->workReports()->exists()) {
                return response()->json([
                    'message' => 'Cannot delete a work order that has associated reports'
                ], 422);
            }
            
            DB::beginTransaction();
            $workOrder->delete();
            DB::commit();

            return response()->json(['message' => 'Work order deleted successfully'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error deleting work order: ' . $e->getMessage());
            return response()->json(['message' => 'Error deleting work order: ' . $e->getMessage()], 500);
        }
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

            if (isset($blockData['zones']) && is_array($blockData['zones'])) {
                $zoneIds = collect($blockData['zones'])->pluck('id')->filter()->values()->toArray();
                if (!empty($zoneIds)) {
                    $block->zones()->attach($zoneIds);
                }
            }

            if (isset($blockData['tasks']) && is_array($blockData['tasks'])) {
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

    /**
     * Update the status of a work order.
     *
     * @param Request $request The HTTP request instance.
     * @param int $id The ID of the work order to update.
     * @return JsonResponse A JSON response confirming the status update.
     */
    public function updateStatus(Request $request, $id): JsonResponse
    {
        try {
            $validated = $request->validate([
                'status' => 'required|integer|in:0,1,2,3',
            ]);

            DB::beginTransaction();
            
            $workOrder = WorkOrder::findOrFail($id);
            $oldStatus = $workOrder->status;
            $newStatus = $validated['status'];
            
            if (!$this->isValidStatusTransition($oldStatus, $newStatus)) {
                return response()->json([
                    'message' => 'Invalid status transition'
                ], 422);
            }
            
            $workOrder->update(['status' => $newStatus]);
            
            if ($newStatus == self::STATUS_COMPLETED) {
                $this->updateAllTasksStatus($workOrder->id, 2);
            } elseif ($newStatus == self::STATUS_IN_PROGRESS) {
                $this->updatePendingTasksStatus($workOrder->id, 1);
            }

            DB::commit();

            return response()->json([
                'message' => 'Work order status updated successfully',
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
        } catch (ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Validation error',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error updating work order status: ' . $e->getMessage());
            return response()->json(['message' => 'Error updating work order status: ' . $e->getMessage()], 500);
        }
    }
    
    /**
     * Check if a status transition is valid.
     *
     * @param int $oldStatus The current status.
     * @param int $newStatus The new status.
     * @return bool Whether the transition is valid.
     */
    private function isValidStatusTransition(int $oldStatus, int $newStatus): bool
    {
        $validTransitions = [
            self::STATUS_NOT_STARTED => [self::STATUS_IN_PROGRESS, self::STATUS_COMPLETED],
            self::STATUS_IN_PROGRESS => [self::STATUS_COMPLETED, self::STATUS_NOT_STARTED],
            self::STATUS_COMPLETED => [self::STATUS_REPORT_SENT, self::STATUS_IN_PROGRESS],
            self::STATUS_REPORT_SENT => []
        ];
        
        if ($oldStatus === $newStatus) {
            return true;
        }
        
        return in_array($newStatus, $validTransitions[$oldStatus] ?? []);
    }
    
    /**
     * Calculate the status of a work order based on its tasks.
     *
     * @param int $id The ID of the work order.
     * @return JsonResponse A JSON response containing the calculated status.
     */
    public function calculateStatus($id): JsonResponse
    {
        try {
            DB::beginTransaction();
            
            $workOrder = WorkOrder::with(['workOrdersBlocks.blockTasks'])->findOrFail($id);
            $status = $this->calculateWorkOrderStatus($workOrder);
            $workOrder->update(['status' => $status]);
            
            DB::commit();
            
            return response()->json([
                'message' => 'Work order status calculated successfully',
                'status' => $status
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error calculating work order status: ' . $e->getMessage());
            return response()->json(['message' => 'Error calculating work order status: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Calculate work order status based on tasks.
     *
     * @param WorkOrder $workOrder The work order object.
     * @return int The calculated status.
     */
    private function calculateWorkOrderStatus(WorkOrder $workOrder): int
    {
        if ($workOrder->workReports()->exists()) {
            return self::STATUS_REPORT_SENT;
        }
        
        if ($workOrder->workOrdersBlocks->isEmpty()) {
            return self::STATUS_NOT_STARTED;
        }
        
        $allTasksPending = true;
        $hasInProgressTask = false;
        $allTasksCompleted = true;
        $hasTasks = false;
        
        foreach ($workOrder->workOrdersBlocks as $block) {
            if ($block->blockTasks->isEmpty()) {
                continue;
            }
            
            foreach ($block->blockTasks as $task) {
                $hasTasks = true;
                
                if ($task->status != 0) {
                    $allTasksPending = false;
                }
                
                if ($task->status == 1) {
                    $hasInProgressTask = true;
                    $allTasksCompleted = false;
                }
                
                if ($task->status != 2) {
                    $allTasksCompleted = false;
                }
            }
        }
        
        if (!$hasTasks || $allTasksPending) {
            return self::STATUS_NOT_STARTED;
        }
        
        if ($allTasksCompleted) {
            return self::STATUS_COMPLETED;
        }
        
        if ($hasInProgressTask) {
            return self::STATUS_IN_PROGRESS;
        }
        
        return self::STATUS_IN_PROGRESS;
    }
    
    /**
     * Update all tasks in a work order to a specific status.
     *
     * @param int $workOrderId The ID of the work order.
     * @param int $status The status to set.
     * @return void
     */
    private function updateAllTasksStatus(int $workOrderId, int $status): void
    {
        $blocks = WorkOrderBlock::where('work_order_id', $workOrderId)->get();
        foreach ($blocks as $block) {
            WorkOrderBlockTask::where('work_order_block_id', $block->id)
                ->update(['status' => $status]);
        }
    }
    
    /**
     * Update only pending tasks in a work order to a specific status.
     *
     * @param int $workOrderId The ID of the work order.
     * @param int $status The status to set.
     * @return void
     */
    private function updatePendingTasksStatus(int $workOrderId, int $status): void
    {
        $blocks = WorkOrderBlock::where('work_order_id', $workOrderId)->get();
        foreach ($blocks as $block) {
            WorkOrderBlockTask::where('work_order_block_id', $block->id)
                ->where('status', 0)
                ->update(['status' => $status]);
        }
    }
}
