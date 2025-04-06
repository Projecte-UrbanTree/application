<?php

namespace App\Http\Controllers\Api\Worker;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\WorkOrder;
use App\Models\WorkOrderBlockTask;
use App\Models\WorkReport;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Api\Admin\WorkOrderController;

class IndexController extends Controller
{
    const TASK_STATUS_PENDING = 0;
    const TASK_STATUS_IN_PROGRESS = 1;
    const TASK_STATUS_COMPLETED = 2;

    const WORK_ORDER_NOT_STARTED = 0;
    const WORK_ORDER_IN_PROGRESS = 1;
    const WORK_ORDER_COMPLETED = 2;
    const WORK_ORDER_REPORT_SENT = 3;

    const REPORT_STATUS_PENDING = 0;
    const REPORT_STATUS_COMPLETED = 1;
    const REPORT_STATUS_REJECTED = 2;
    const REPORT_STATUS_CLOSED_WITH_INCIDENTS = 3;

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

    /**
     * Create a new work report for a completed work order.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function createWorkReport(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'work_order_id' => ['required', 'integer', 'exists:work_orders,id'],
                'spent_fuel' => ['required', 'numeric', 'min:0'],
                'report_incidents' => ['nullable', 'string'],
                'report_status' => ['required', 'integer', 'in:0,1,2,3'],
                'resources' => ['nullable', 'array'],
                'resources.*.resource_id' => ['required', 'integer', 'exists:resources,id'],
                'resources.*.quantity' => ['required', 'numeric', 'min:0'],
            ]);

            // Check if this worker is assigned to this work order
            $user = $request->user();
            $workOrder = WorkOrder::findOrFail($validated['work_order_id']);
            
            if (!$workOrder->users->contains($user->id)) {
                return response()->json([
                    'message' => 'You are not assigned to this work order',
                ], 403);
            }

            // Check if the work order is in a state where a report can be created
            if ($workOrder->status >= self::WORK_ORDER_REPORT_SENT) {
                return response()->json([
                    'message' => 'This work order already has a report sent',
                ], 400);
            }

            DB::beginTransaction();

            $workReport = WorkReport::create([
                'work_order_id' => $validated['work_order_id'],
                'spent_fuel' => $validated['spent_fuel'],
                'report_incidents' => $validated['report_incidents'] ?? null,
                'report_status' => $validated['report_status'],
            ]);

            // Update work order status to report sent
            $workOrder->status = self::WORK_ORDER_REPORT_SENT;
            $workOrder->save();

            if (isset($validated['resources']) && is_array($validated['resources'])) {
                foreach ($validated['resources'] as $resource) {
                    $workReport->workReportResources()->create([
                        'resource_id' => $resource['resource_id'],
                        'quantity' => $resource['quantity'],
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Work report created successfully',
                'work_report' => $workReport->load(['workOrder', 'resources']),
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error creating work report: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'An error occurred while creating the work report',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
