<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Resource;

class ResourceController extends Controller
{
    public function index()
    {
        return Resource::all();
    }
}
