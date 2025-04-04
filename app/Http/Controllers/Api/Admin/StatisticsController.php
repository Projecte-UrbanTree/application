<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Resource;
use App\Models\WorkOrderBlockTask;
use App\Models\WorkReport;
use App\Models\WorkReportResource;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class StatisticsController extends Controller
{
    /**
     * Display statistics for tasks, reports, and resources within a date range.
     *
     * @param Request $request The HTTP request instance.
     * @return JsonResponse A JSON response containing the statistics data.
     */
    public function index(Request $request): JsonResponse
    {
        $dateFormatInput = 'd-m-Y';
        $dateFormatQuery = 'Y-m-d';
        $defaultFromDate = Carbon::now()->startOfWeek();
        $defaultToDate = Carbon::now()->endOfWeek();

        try {
            $fromDate = Carbon::createFromFormat($dateFormatInput, $request->input('from_date', $defaultFromDate->format($dateFormatInput)))->startOfDay();
            $toDate = Carbon::createFromFormat($dateFormatInput, $request->input('to_date', $defaultToDate->format($dateFormatInput)))->endOfDay();

            if ($fromDate->gt($toDate)) {
                $fromDate = $defaultFromDate;
                $toDate = $defaultToDate;
            }
        } catch (\Exception $e) {
            Log::warning('Invalid date format in statistics request: ' . $e->getMessage());
            $fromDate = $defaultFromDate;
            $toDate = $defaultToDate;
        }

        $fromDateSql = $fromDate->format($dateFormatQuery);
        $toDateSql = $toDate->format($dateFormatQuery);

        $days = collect($fromDate->daysUntil($toDate->copy()->addDay()))->map(fn ($date) => $date->format($dateFormatQuery))->toArray();

        $tasks = WorkOrderBlockTask::with(['workOrderBlock.workOrder'])
            ->whereHas('workOrderBlock.workOrder', fn (Builder $query) => $query->whereBetween('date', [$fromDateSql, $toDateSql]))
            ->get();

        $filteredTasks = $tasks->filter(fn ($t) => $t->workOrderBlock?->workOrder?->date && Carbon::parse($t->workOrderBlock->workOrder->date)->between($fromDate, $toDate));

        $tasksDoneCount = $this->countTasksByDay($filteredTasks, $days, 1);
        $tasksNotDoneCount = $this->countTasksByDay($filteredTasks, $days, 0);
        $hoursWorked = $this->sumHoursByDay($filteredTasks, $days);

        $reports = WorkReport::with('workOrder')
            ->whereHas('workOrder', fn (Builder $query) => $query->whereBetween('date', [$fromDateSql, $toDateSql]))
            ->get();

        $fuelConsumption = $this->sumFuelByDay($reports, $days);

        $allResources = Resource::select('id', 'name', 'unit_name')->orderBy('name')->get();
        $resourceUsageByDay = $this->calculateResourceUsage($fromDateSql, $toDateSql);

        return response()->json([
            'days' => $days,
            'tasksDoneCount' => $tasksDoneCount,
            'tasksNotDoneCount' => $tasksNotDoneCount,
            'hoursWorked' => $hoursWorked,
            'fuelConsumption' => $fuelConsumption,
            'summary' => [
                'tasks_done_total' => $filteredTasks->where('status', 1)->count(),
                'tasks_not_done_total' => $filteredTasks->where('status', 0)->count(),
                'hours_worked_total' => $filteredTasks->sum(fn ($t) => (float) $t->spent_time),
                'fuel_consumption_total' => $reports->sum(fn ($r) => (float) $r->spent_fuel),
            ],
            'resourcesList' => $allResources,
            'resourceUsageData' => $resourceUsageByDay,
        ]);
    }

    /**
     * Count tasks by day and status.
     *
     * @param mixed $tasks The collection of tasks.
     * @param array $days The array of days.
     * @param int $status The status of the tasks to count.
     * @return array An array of task counts by day.
     */
    private function countTasksByDay($tasks, $days, $status): array
    {
        return collect($days)->map(fn ($day) => $tasks->where('status', $status)->filter(fn ($t) => Carbon::parse($t->workOrderBlock->workOrder->date)->format('Y-m-d') === $day)->count())->toArray();
    }

    /**
     * Sum hours worked by day.
     *
     * @param mixed $tasks The collection of tasks.
     * @param array $days The array of days.
     * @return array An array of hours worked by day.
     */
    private function sumHoursByDay($tasks, $days): array
    {
        return collect($days)->map(fn ($day) => $tasks->filter(fn ($t) => Carbon::parse($t->workOrderBlock->workOrder->date)->format('Y-m-d') === $day)->sum(fn ($t) => (float) $t->spent_time))->toArray();
    }

    /**
     * Sum fuel consumption by day.
     *
     * @param mixed $reports The collection of work reports.
     * @param array $days The array of days.
     * @return array An array of fuel consumption by day.
     */
    private function sumFuelByDay($reports, $days): array
    {
        return collect($days)->map(fn ($day) => $reports->filter(fn ($r) => Carbon::parse($r->workOrder->date)->format('Y-m-d') === $day)->sum(fn ($r) => (float) $r->spent_fuel))->toArray();
    }

    /**
     * Calculate resource usage by day within a date range.
     *
     * @param string $fromDateSql The start date in SQL format.
     * @param string $toDateSql The end date in SQL format.
     * @return array An array of resource usage data by day.
     */
    private function calculateResourceUsage(string $fromDateSql, string $toDateSql): array
    {
        $resourceUsageRecords = WorkReportResource::whereHas('workReport.workOrder', fn ($q) => $q->whereBetween('date', [$fromDateSql, $toDateSql]))
            ->with(['workReport', 'workReport.workOrder'])
            ->get();

        $resourceUsageByDay = [];
        foreach ($resourceUsageRecords as $record) {
            $dateKey = Carbon::parse($record->workReport->workOrder->date)->format('Y-m-d');
            $resourceId = $record->resource_id;
            $quantity = (float) $record->quantity;

            if ($quantity > 0) {
                $resourceUsageByDay[$resourceId][$dateKey] = ($resourceUsageByDay[$resourceId][$dateKey] ?? 0) + $quantity;
            }
        }

        return $resourceUsageByDay;
    }
}
