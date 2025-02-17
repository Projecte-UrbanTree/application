<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\TaskType;

class TaskTypeController extends Controller
{
    public function index()
    {
        return TaskType::all();
    }
}
