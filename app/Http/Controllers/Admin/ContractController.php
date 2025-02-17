<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Contract;

class ContractController extends Controller
{
    public function index()
    {
        return Contract::all();
    }
}
