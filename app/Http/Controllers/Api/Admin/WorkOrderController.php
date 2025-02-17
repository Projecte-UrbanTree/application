<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\WorkOrder;

class WorkOrderController extends Controller
{
    public function index()
    {
        return WorkOrder::all();
    }
}
