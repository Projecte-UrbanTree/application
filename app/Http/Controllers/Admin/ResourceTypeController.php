<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\ResourceType;

class ResourceTypeController extends Controller
{
    public function index()
    {
        return ResourceType::all();
    }
}
