<?php

namespace App\Http\Controllers\Api\Worker;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\WorkOrder;
use App\Models\WorkOrderBlockTask;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Api\Admin\WorkOrderController;

class IndexController extends Controller
{
    const TASK_STATUS_PENDING = 0;
    const TASK_STATUS_IN_PROGRESS = 1;
    const TASK_STATUS_COMPLETED = 2;

    /**
     * Display a listing of work orders for the worker.
     *
     * @param Request $request The HTTP request instance.
     * @return JsonResponse A JSON response containing the list of work orders.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $userId = auth()->id();
            $contractId = $request->header('X-Contract-Id');
            $date = $request->input('date');

            $query = WorkOrder::with([
                'contract',
                'users',
                'workOrdersBlocks',
                'workOrdersBlocks.zones',
                'workOrdersBlocks.blockTasks.elementType',
                'workOrdersBlocks.blockTasks.treeType',
                'workOrdersBlocks.blockTasks.tasksType',
                'workReports',
            ]);
            
            if ($contractId && $contractId > 0) {
                $query->where('contract_id', (int)$contractId);
            }

            if ($date) {
                $query->whereDate('date', $date);
            }

            $query->whereHas('users', function ($q) use ($userId) {
                $q->where('user_id', $userId);
            });

            $workOrders = $query->get();
            
            Log::info("Found {$workOrders->count()} work orders for user {$userId}" . ($date ? " on date {$date}" : ""));

            return response()->json($workOrders);
        } catch (\Exception $e) {
            $userId = auth()->id() ?? 'unknown';
            $contractId = $request->header('X-Contract-Id') ?? 'none';
            Log::error("Error fetching work orders for worker ID: {$userId}, contract ID: {$contractId}. Error: {$e->getMessage()}");
            Log::error($e->getTraceAsString());
            return response()->json(['message' => 'Error fetching work orders: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Update a task's status within a work order.
     *
     * @param Request $request The HTTP request instance.
     * @param int $taskId The ID of the task to update.
     * @return JsonResponse A JSON response indicating the result of the update.
     */
    public function updateTaskStatus(Request $request, int $taskId): JsonResponse
    {
        try {
            $validated = $request->validate([
                'status' => 'required|integer|in:0,1,2',
                'spent_time' => 'sometimes|numeric|min:0',
            ]);

            DB::beginTransaction();

            $task = WorkOrderBlockTask::with(['workOrderBlock.workOrder'])
                ->findOrFail($taskId);

            $userId = auth()->id();
            $workOrder = $task->workOrderBlock->workOrder;
            
            if (!$workOrder->users()->where('user_id', $userId)->exists()) {
                throw new \Exception('You are not assigned to this work order');
            }

            if ($workOrder->status >= 2) {
                throw new \Exception('Cannot update tasks in a completed work order or one with a report');
            }

            $task->status = $validated['status'];
            if (isset($validated['spent_time']) && $validated['status'] == self::TASK_STATUS_COMPLETED) {
                $task->spent_time = $validated['spent_time'];
            }
            $task->save();

            if ($workOrder->status == 0 && $validated['status'] > 0) {
                $workOrder->status = 1;
                $workOrder->save();
            }

            $this->recalculateWorkOrderStatus($workOrder);

            DB::commit();

            return response()->json([
                'message' => 'Task status updated successfully',
                'task' => $task->fresh(),
                'work_order_status' => $workOrder->status
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Error updating task status: {$e->getMessage()}");
            return response()->json(['message' => 'Error updating task status: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Recalculate and update work order status based on tasks.
     *
     * @param WorkOrder $workOrder The work order to update.
     * @return void
     */
    private function recalculateWorkOrderStatus(WorkOrder $workOrder): void
    {
        $workOrder->load('workOrdersBlocks.blockTasks');
        
        $totalTasks = 0;
        $completedTasks = 0;
        $inProgressTasks = 0;

        foreach ($workOrder->workOrdersBlocks as $block) {
            foreach ($block->blockTasks as $task) {
                $totalTasks++;
                if ($task->status == self::TASK_STATUS_COMPLETED) {
                    $completedTasks++;
                } elseif ($task->status == self::TASK_STATUS_IN_PROGRESS) {
                    $inProgressTasks++;
                }
            }
        }

        if ($totalTasks === 0) {
            return;
        }

        if ($completedTasks === $totalTasks) {
            $workOrder->status = WorkOrderController::STATUS_COMPLETED;
        } elseif ($inProgressTasks > 0 || $completedTasks > 0) {
            $workOrder->status = WorkOrderController::STATUS_IN_PROGRESS;
        } else {
            $workOrder->status = WorkOrderController::STATUS_NOT_STARTED;
        }

        $workOrder->save();
        
        Log::info("Work order {$workOrder->id} status updated to {$workOrder->status}. " .
                  "Completed tasks: {$completedTasks}/{$totalTasks}");
    }
}
