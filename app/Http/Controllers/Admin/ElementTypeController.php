<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ElementType;

class ElementTypeController extends Controller
{
    public function index()
    {
        return ElementType::all();
    }
}
