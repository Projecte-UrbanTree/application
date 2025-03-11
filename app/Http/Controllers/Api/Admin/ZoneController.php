<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Zone;
class ZoneController extends Controller
{
    public function index() 
    {
        return Zone::all();
    }
}
