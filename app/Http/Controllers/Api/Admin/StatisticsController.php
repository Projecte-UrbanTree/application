<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Contract;
use App\Models\Element;
use App\Models\Resource;
use App\Models\User;
use App\Models\WorkOrder;
use App\Models\WorkOrderBlockTask;
use App\Models\WorkReport;
use App\Models\WorkReportResource;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log; // Asegúrate de importar Log

class StatisticsController extends Controller
{
    public function index(Request $request)
    {
        $defaultFromDate = Carbon::now()->startOfWeek();
        $defaultToDate = Carbon::now()->endOfWeek();
        $dateFormatInput = 'd-m-Y';
        $dateFormatQuery = 'Y-m-d';

        try {
            $fromDate = Carbon::createFromFormat($dateFormatInput, $request->input('from_date', $defaultFromDate->format($dateFormatInput)))->startOfDay();
            $toDate = Carbon::createFromFormat($dateFormatInput, $request->input('to_date', $defaultToDate->format($dateFormatInput)))->endOfDay();
            if ($fromDate->gt($toDate)) {
                $fromDate = $defaultFromDate;
                $toDate = $defaultToDate;
            }
        } catch (\Exception $e) {
            Log::warning('Invalid date format in statistics request: ' . $e->getMessage(), ['request_data' => $request->all()]);
            $fromDate = $defaultFromDate;
            $toDate = $defaultToDate;
        }

        $fromDateSql = $fromDate->format($dateFormatQuery);
        $toDateSql = $toDate->format($dateFormatQuery);

        $days = [];
        $period = $fromDate->copy()->daysUntil($toDate->copy()->addDay());
        foreach ($period as $date) {
            $days[] = $date->format($dateFormatQuery);
        }
        Log::debug("[Stats] Date range: {$fromDateSql} to {$toDateSql}. Days:", $days);

        $tasks = WorkOrderBlockTask::with([
            'workOrderBlock.workOrder' => function ($query) use ($fromDateSql, $toDateSql) {
                $query->whereBetween('date', [$fromDateSql, $toDateSql]);
            },
        ])->whereHas('workOrderBlock.workOrder', function (Builder $query) use ($fromDateSql, $toDateSql) {
            $query->whereBetween('date', [$fromDateSql, $toDateSql]);
        })->get();

        $filteredTasks = $tasks->filter(function ($t) use ($fromDateSql, $toDateSql, $dateFormatQuery) {
            if (!$t->workOrderBlock || !$t->workOrderBlock->workOrder || !$t->workOrderBlock->workOrder->date) {
                return false;
            }
            try {
                $d = Carbon::parse($t->workOrderBlock->workOrder->date);

                return $d->format($dateFormatQuery) >= $fromDateSql && $d->format($dateFormatQuery) <= $toDateSql;
            } catch (\Exception $e) {
                return false;
            }
        });

        $doneTasks = $filteredTasks->where('status', 1);
        $notDoneTasks = $filteredTasks->where('status', 0);
        $tasksDoneCount = [];
        $tasksNotDoneCount = [];
        $hoursWorked = [];
        $tasksByDay = $filteredTasks->groupBy(function ($t) use ($dateFormatQuery) {
            try {
                return Carbon::parse($t->workOrderBlock->workOrder->date)->format($dateFormatQuery);
            } catch (\Exception $e) {
                return 'invalid_date';
            }
        });
        foreach ($days as $day) {
            $tasksForDay = $tasksByDay->get($day, collect());
            $tasksDoneCount[] = $tasksForDay->where('status', 1)->count();
            $tasksNotDoneCount[] = $tasksForDay->where('status', 0)->count();
            $hoursWorked[] = $tasksForDay->sum(function ($t) {
                return is_numeric($t->spent_time) ? (float) $t->spent_time : 0;
            });
        }

        $reports = WorkReport::with('workOrder')->whereHas('workOrder', function (Builder $query) use ($fromDateSql, $toDateSql) {
            $query->whereBetween('date', [$fromDateSql, $toDateSql]);
        })->get();
        $reportsByDay = $reports->filter(function ($r) use ($fromDateSql, $toDateSql, $dateFormatQuery) {
            if (!$r->workOrder || !$r->workOrder->date) {
                return false;
            }
            try {
                $d = Carbon::parse($r->workOrder->date);

                return $d->format($dateFormatQuery) >= $fromDateSql && $d->format($dateFormatQuery) <= $toDateSql;
            } catch (\Exception $e) {
                return false;
            }
        })->groupBy(function ($r) use ($dateFormatQuery) {
            try {
                return Carbon::parse($r->workOrder->date)->format($dateFormatQuery);
            } catch (\Exception $e) {
                return 'invalid_date';
            }
        });
        $fuelConsumption = [];
        foreach ($days as $day) {
            $reportsForDay = $reportsByDay->get($day, collect());
            $fuelConsumption[] = $reportsForDay->sum(function ($r) {
                return is_numeric($r->spent_fuel) ? (float) $r->spent_fuel : 0;
            });
        }

        $allResources = Resource::select('id', 'name', 'unit_name')->orderBy('name')->get();

        Log::debug("[Stats] Fetching WorkReportResource for range {$fromDateSql} to {$toDateSql}");
        $resourceUsageRecords = WorkReportResource::whereHas('workReport.workOrder', function ($q) use ($fromDateSql, $toDateSql) {
            $q->whereBetween('date', [$fromDateSql, $toDateSql]);
        })
            ->with(['workReport', 'workReport.workOrder']) // Carga completa para depurar
            ->get();
        Log::info('[Stats] Found ' . $resourceUsageRecords->count() . ' WorkReportResource records potentially in range.');

        $resourceUsageByDay = [];
        foreach ($resourceUsageRecords as $record) {
            if (!$record->workReport || !$record->workReport->workOrder || !$record->workReport->workOrder->date) {
                Log::debug("[Stats] Skipping WRR ID={$record->id}: Missing related data (WR exists: " . ($record->workReport ? 'Yes' : 'No') . ', WR->WO exists: ' . ($record->workReport && $record->workReport->workOrder ? 'Yes' : 'No') . ', WR->WO->date exists: ' . ($record->workReport && $record->workReport->workOrder && $record->workReport->workOrder->date ? 'Yes' : 'No') . ')');

                continue;
            }

            $resourceId = $record->resource_id;
            $quantity = is_numeric($record->quantity) ? (float) $record->quantity : 0;

            if ($quantity <= 0) { // Considerar <= 0 por si acaso
                Log::debug("[Stats] Skipping WRR ID={$record->id}, Res ID={$resourceId}: Quantity is zero or negative ({$record->quantity}).");

                continue;
            }

            try {
                $dateKey = Carbon::parse($record->workReport->workOrder->date)->format($dateFormatQuery);
                if ($dateKey < $fromDateSql || $dateKey > $toDateSql) { // Check redundante por seguridad
                    Log::debug("[Stats] Skipping WRR ID={$record->id}, Res ID={$resourceId}: Date {$dateKey} outside range {$fromDateSql}-{$toDateSql} (Unexpected).");

                    continue;
                }
            } catch (\Exception $e) {
                Log::warning("[Stats] Invalid date parsing WRR ID={$record->id}, Res ID={$resourceId}. Date val: '" . $record->workReport->workOrder->date . "'. Error: " . $e->getMessage());

                continue;
            }

            if (!isset($resourceUsageByDay[$resourceId])) {
                $resourceUsageByDay[$resourceId] = [];
            }
            if (!isset($resourceUsageByDay[$resourceId][$dateKey])) {
                $resourceUsageByDay[$resourceId][$dateKey] = 0;
            }

            $resourceUsageByDay[$resourceId][$dateKey] += $quantity;
            Log::debug("[Stats] Processed WRR ID={$record->id}: Res={$resourceId}, Date={$dateKey}, Added Qty={$quantity}, New Total={$resourceUsageByDay[$resourceId][$dateKey]}");

        } // Fin foreach

        Log::info('[Stats] Final resourceUsageByDay array structure:', $resourceUsageByDay);

        $tasks_done_total = $doneTasks->count();
        $tasks_not_done_total = $notDoneTasks->count();
        $hours_worked_total = $filteredTasks->sum(function ($t) {
            return is_numeric($t->spent_time) ? (float) $t->spent_time : 0;
        });
        $fuel_consumption_total = $reports->sum(function ($r) {
            return is_numeric($r->spent_fuel) ? (float) $r->spent_fuel : 0;
        });

        return response()->json([
            'days' => $days,
            'tasksDoneCount' => $tasksDoneCount,
            'tasksNotDoneCount' => $tasksNotDoneCount,
            'hoursWorked' => $hoursWorked,
            'fuelConsumption' => $fuelConsumption,
            'summary' => [
                'tasks_done_total' => $tasks_done_total,
                'tasks_not_done_total' => $tasks_not_done_total,
                'hours_worked_total' => $hours_worked_total,
                'fuel_consumption_total' => $fuel_consumption_total,
            ],
            'resourcesList' => $allResources,
            'resourceUsageData' => $resourceUsageByDay,
        ]);
    }

    public function metrics(Request $request)
    {
        $contractId = $request->user()->selected_contract_id;

        // Count of contracts, elements, work orders and users, this last should count admin, customers and workers related to the contract
        $users = User::whereIn('role', ['admin', 'customer']) // Count all admins and customers
            ->when($contractId, function ($query) use ($contractId) {
                // Count only workers assigned to the contract
                return $query->orWhereHas('contracts', function ($q) use ($contractId) {
                    $q->where('contracts.id', $contractId);
                });
            }, function ($query) {
                // If no contract is provided, count all workers
                return $query->orWhere('role', 'worker');
            })
            ->count();

        return response()->json([
            'user' => $users,
            'user_all' => User::count(),
            'contract' => Contract::count(),
            'element' => Element::when($contractId > 0, function ($query) use ($contractId) {
                return $query->whereHas('point.zones', function ($q) use ($contractId) {
                    $q->where('contract_id', $contractId);
                });
            })->count(),
            'element_all' => Element::count(),
            'work_order' => WorkOrder::when($contractId > 0, function ($query) use ($contractId) {
                return $query->where('contract_id', $contractId);
            })->count(),
            'work_order_all' => WorkOrder::count(),
        ]);
    }
}
