<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Resource;
use Illuminate\Http\Request;

class ResourceController extends Controller
{
    public function index(Request $request)
    {
        $contract_id = $request->header('X-Contract-Id');
        if (! $contract_id) {
            return Resource::all();
        }

        return Resource::where('contract_id', $contract_id)->get();
    }
}
