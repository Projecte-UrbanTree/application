<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\TaskType;

class TaskTypeController extends Controller
{
    public function index()
    {
        return TaskType::all();
    }
}
