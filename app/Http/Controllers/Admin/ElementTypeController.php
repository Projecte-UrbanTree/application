<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\ElementType;

class ElementTypeController extends Controller
{
    public function index()
    {
        return ElementType::all();
    }
}
