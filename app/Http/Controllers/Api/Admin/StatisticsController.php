<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\WorkOrderBlockTask;
use App\Models\WorkReport;
use Illuminate\Http\Request;
use Carbon\Carbon;

class StatisticsController extends Controller
{
    public function index(Request $request)
    {
        $fromDate = $request->input('from_date', Carbon::now()->startOfWeek()->format('Y-m-d'));
        $toDate = $request->input('to_date', Carbon::now()->endOfWeek()->format('Y-m-d'));
        $days = [];
        $period = Carbon::parse($fromDate)->daysUntil(Carbon::parse($toDate));
        foreach ($period as $date) {
            $days[] = $date->format('Y-m-d');
        }
        $tasks = WorkOrderBlockTask::with('workOrderBlock.workOrder')->get();
        $filtered = $tasks->filter(function ($t) use ($fromDate, $toDate) {
            $d = Carbon::parse($t->workOrderBlock->workOrder->date);
            return $d->between($fromDate, $toDate);
        });
        $done = $filtered->where('status', 1);
        $notDone = $filtered->where('status', 0);
        $tasksDoneCount = [];
        $tasksNotDoneCount = [];
        $hoursWorked = [];
        foreach ($days as $day) {
            $d1 = $done->filter(function ($t) use ($day) {
                return Carbon::parse($t->workOrderBlock->workOrder->date)->format('Y-m-d') === $day;
            })->count();
            $tasksDoneCount[] = $d1;
            $d2 = $notDone->filter(function ($t) use ($day) {
                return Carbon::parse($t->workOrderBlock->workOrder->date)->format('Y-m-d') === $day;
            })->count();
            $tasksNotDoneCount[] = $d2;
            $h = $filtered->filter(function ($t) use ($day) {
                return Carbon::parse($t->workOrderBlock->workOrder->date)->format('Y-m-d') === $day;
            })->sum('spent_time');
            $hoursWorked[] = $h;
        }
        $reports = WorkReport::with('workOrder')->get()->filter(function ($r) use ($fromDate, $toDate) {
            $d = Carbon::parse($r->workOrder->date);
            return $d->between($fromDate, $toDate);
        });
        $fuelConsumption = [];
        foreach ($days as $day) {
            $f = $reports->filter(function ($r) use ($day) {
                return Carbon::parse($r->workOrder->date)->format('Y-m-d') === $day;
            })->sum('spent_fuel');
            $fuelConsumption[] = $f;
        }
        return response()->json([
            'days' => $days,
            'tasksDoneCount' => $tasksDoneCount,
            'tasksNotDoneCount' => $tasksNotDoneCount,
            'hoursWorked' => $hoursWorked,
            'fuelConsumption' => $fuelConsumption
        ]);
    }
}
