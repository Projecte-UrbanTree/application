<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ResourceType;

class ResourceTypeController extends Controller
{
    public function index()
    {
        return ResourceType::all();
    }
}
