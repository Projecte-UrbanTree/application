<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TreeType;

class TreeTypeController extends Controller
{
    public function index()
    {
        return TreeType::all();
    }
}
