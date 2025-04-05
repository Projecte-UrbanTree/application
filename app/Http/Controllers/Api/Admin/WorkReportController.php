<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\WorkReport;
use App\Models\WorkOrder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class WorkReportController extends Controller
{
    const STATUS_PENDING = 0;
    const STATUS_COMPLETED = 1;
    const STATUS_REJECTED = 2;
    const STATUS_CLOSED_WITH_INCIDENTS = 3;
    
    const WORK_ORDER_NOT_STARTED = 0;
    const WORK_ORDER_IN_PROGRESS = 1;
    const WORK_ORDER_COMPLETED = 2;
    const WORK_ORDER_REPORT_SENT = 3;

    /**
     * Display a listing of work reports.
     *
     * @return JsonResponse A JSON response containing the list of work reports.
     */
    public function index(): JsonResponse
    {
        try {
            $workReports = WorkReport::with([
                'workOrder', 
                'workOrder.contract', 
                'resources'
            ])->get();
            
            return response()->json($workReports, 200);
        } catch (\Exception $e) {
            Log::error('Error fetching work reports: ' . $e->getMessage());
            return response()->json(['message' => 'Error fetching work reports'], 500);
        }
    }

    /**
     * Store a newly created work report in storage.
     *
     * @param Request $request The HTTP request instance.
     * @return JsonResponse A JSON response containing the created work report.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'observation' => ['nullable', 'string', 'max:255'],
                'spent_fuel' => ['required', 'numeric', 'min:0'],
                'work_order_id' => ['required', 'integer', 'exists:work_orders,id'],
                'report_status' => ['required', 'integer', 'in:0,1,2,3'],
                'report_incidents' => ['nullable', 'string'],
                'resources' => ['nullable', 'array'],
                'resources.*.resource_id' => ['required', 'integer', 'exists:resources,id'],
                'resources.*.quantity' => ['required', 'numeric', 'min:0'],
            ]);

            DB::beginTransaction();
            
            $workReport = WorkReport::create([
                'observation' => $validated['observation'] ?? null,
                'spent_fuel' => $validated['spent_fuel'],
                'work_order_id' => $validated['work_order_id'],
                'report_status' => $validated['report_status'],
                'report_incidents' => $validated['report_incidents'] ?? null,
            ]);
            
            $workOrder = WorkOrder::findOrFail($validated['work_order_id']);
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
            
            $workReport->load([
                'workOrder',
                'workOrder.contract',
                'resources',
                'workReportResources'
            ]);

            return response()->json($workReport, 201);
        } catch (ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Validation error',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error creating work report: ' . $e->getMessage());
            return response()->json(['message' => 'Error creating work report'], 500);
        }
    }

    /**
     * Display the specified work report.
     *
     * @param int $id The ID of the work report to retrieve.
     * @return JsonResponse A JSON response containing the work report details.
     */
    public function show($id): JsonResponse
    {
        try {
            $workReport = WorkReport::with([
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
                'workReportResources',
            ])->find($id);

            if (!$workReport) {
                return response()->json([
                    'message' => 'Work report not found'
                ], 404);
            }

            return response()->json($workReport, 200);
        } catch (\Exception $e) {
            Log::error('Error fetching work report: ' . $e->getMessage());
            return response()->json(['message' => 'Error fetching work report'], 500);
        }
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
        DB::beginTransaction();
        
        try {
            $workReport = WorkReport::findOrFail($id);
            $workOrderId = $workReport->work_order_id;

            $validated = $request->validate([
                'observation' => ['sometimes', 'nullable', 'string', 'max:255'],
                'spent_fuel' => ['sometimes', 'numeric', 'min:0'],
                'report_status' => ['sometimes', 'integer', 'in:0,1,2,3'],
                'report_incidents' => ['sometimes', 'nullable', 'string'],
                'resources' => ['sometimes', 'array'],
                'resources.*.resource_id' => ['required_with:resources', 'integer', 'exists:resources,id'],
                'resources.*.quantity' => ['required_with:resources', 'numeric', 'min:0'],
            ]);

            $workReport->update($validated);
            
            if (isset($validated['resources'])) {
                $workReport->workReportResources()->delete();
                
                foreach ($validated['resources'] as $resource) {
                    $workReport->workReportResources()->create([
                        'resource_id' => $resource['resource_id'],
                        'quantity' => $resource['quantity'],
                    ]);
                }
            }

            if ($request->has('report_status')) {
                $this->updateWorkOrderStatus($workOrderId, $validated['report_status']);
            }

            DB::commit();

            $updatedReport = WorkReport::with([
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
                'workReportResources',
            ])->find($id);

            return response()->json($updatedReport, 200);
        } catch (ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Validation error',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error updating work report: ' . $e->getMessage());
            return response()->json(['message' => 'Error updating work report: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Update the work order status based on report status.
     *
     * @param int $workOrderId The ID of the work order.
     * @param int $reportStatus The report status.
     * @return void
     */
    private function updateWorkOrderStatus(int $workOrderId, int $reportStatus): void
    {
        $workOrder = WorkOrder::findOrFail($workOrderId);
        
        $statusMapping = [
            self::STATUS_PENDING => self::WORK_ORDER_REPORT_SENT,
            self::STATUS_COMPLETED => self::WORK_ORDER_COMPLETED,
            self::STATUS_REJECTED => self::WORK_ORDER_IN_PROGRESS,
            self::STATUS_CLOSED_WITH_INCIDENTS => self::WORK_ORDER_COMPLETED,
        ];
        
        if (isset($statusMapping[$reportStatus])) {
            $workOrder->status = $statusMapping[$reportStatus];
            $workOrder->save();
        }
    }

    /**
     * Remove the specified work report from storage.
     *
     * @param int $id The ID of the work report to delete.
     * @return JsonResponse A JSON response confirming the deletion.
     */
    public function destroy($id): JsonResponse
    {
        try {
            DB::beginTransaction();
            
            $workReport = WorkReport::findOrFail($id);
            $workOrderId = $workReport->work_order_id;
            
            $workReport->delete();
            
            $this->recalculateWorkOrderStatus($workOrderId);
            
            DB::commit();
            
            return response()->json(['message' => 'Work report deleted successfully'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error deleting work report: ' . $e->getMessage());
            return response()->json(['message' => 'Error deleting work report'], 500);
        }
    }
    
    /**
     * Recalculate work order status after report deletion.
     *
     * @param int $workOrderId The ID of the work order.
     * @return void
     */
    private function recalculateWorkOrderStatus(int $workOrderId): void
    {
        $workOrder = WorkOrder::with(['workReports', 'workOrdersBlocks.blockTasks'])->findOrFail($workOrderId);
        
        if ($workOrder->workReports->isEmpty()) {
            $allTasksCompleted = true;
            $hasInProgressTask = false;
            $hasTask = false;
            
            foreach ($workOrder->workOrdersBlocks as $block) {
                foreach ($block->blockTasks as $task) {
                    $hasTask = true;
                    if ($task->status != 2) {
                        $allTasksCompleted = false;
                    }
                    if ($task->status == 1) {
                        $hasInProgressTask = true;
                    }
                }
            }
            
            if (!$hasTask) {
                $workOrder->status = self::WORK_ORDER_NOT_STARTED;
            } else if ($allTasksCompleted) {
                $workOrder->status = self::WORK_ORDER_COMPLETED;
            } else if ($hasInProgressTask) {
                $workOrder->status = self::WORK_ORDER_IN_PROGRESS;
            } else {
                $workOrder->status = self::WORK_ORDER_NOT_STARTED;
            }
        } else {
            $latestReport = $workOrder->workReports->sortByDesc('created_at')->first();
            $this->updateWorkOrderStatus($workOrderId, $latestReport->report_status);
        }
        
        $workOrder->save();
    }
}
