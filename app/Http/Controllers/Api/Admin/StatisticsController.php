<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\WorkOrderBlockTask;
use App\Models\WorkReport;
use Carbon\Carbon;
use Illuminate\Http\Request;

class StatisticsController extends Controller
{
    public function index(Request $request)
    {
        // Filter dates
        $fromDate = $request->input('from_date', Carbon::now()->startOfWeek()->format('Y-m-d'));
        $toDate = $request->input('to_date', Carbon::now()->endOfWeek()->format('Y-m-d'));

        // Array days samples ["2023-03-06", "2023-03-07", ...])
        $days = [];
        $period = Carbon::parse($fromDate)->daysUntil(Carbon::parse($toDate));
        foreach ($period as $date) {
            $days[] = $date->format('Y-m-d');
        }

        // WorkOrderBlockTask get info right there
        $tasks = WorkOrderBlockTask::with('workOrderBlock.workOrder')->get();

        $filtered = $tasks->filter(function ($t) use ($fromDate, $toDate) {
            $d = Carbon::parse($t->workOrderBlock->workOrder->date);

            return $d->between($fromDate, $toDate);
        });

        //  Tasks done (status=1) & no done (status=0)
        $done = $filtered->where('status', 1);
        $notDone = $filtered->where('status', 0);

        // save daily values?
        $tasksDoneCount = [];
        $tasksNotDoneCount = [];
        $hoursWorked = [];

        // tasks, how many done..
        foreach ($days as $day) {
            // Tasks done x day
            $d1 = $done->filter(function ($t) use ($day) {
                return Carbon::parse($t->workOrderBlock->workOrder->date)->format('Y-m-d') === $day;
            })->count();
            $tasksDoneCount[] = $d1;

            // Tasks not done
            $d2 = $notDone->filter(function ($t) use ($day) {
                return Carbon::parse($t->workOrderBlock->workOrder->date)->format('Y-m-d') === $day;
            })->count();
            $tasksNotDoneCount[] = $d2;

            // Hours worked (spent_time)
            $h = $filtered->filter(function ($t) use ($day) {
                return Carbon::parse($t->workOrderBlock->workOrder->date)->format('Y-m-d') === $day;
            })->sum('spent_time');
            $hoursWorked[] = $h;
        }

        // WorkReport (fuel used)
        $reports = WorkReport::with('workOrder')->get()->filter(function ($r) use ($fromDate, $toDate) {
            $d = Carbon::parse($r->workOrder->date);

            return $d->between($fromDate, $toDate);
        });

        // Array fuel used
        $fuelConsumption = [];
        foreach ($days as $day) {
            $f = $reports->filter(function ($r) use ($day) {
                return Carbon::parse($r->workOrder->date)->format('Y-m-d') === $day;
            })->sum('spent_fuel');
            $fuelConsumption[] = $f;
        }

        // Total
        $tasks_done_total = $done->count();
        $tasks_not_done_total = $notDone->count();
        $hours_worked_total = $filtered->sum('spent_time');
        $fuel_consumption_total = $reports->sum('spent_fuel');

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
        ]);
    }
}
