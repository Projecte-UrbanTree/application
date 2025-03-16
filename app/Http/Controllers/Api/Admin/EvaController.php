<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\EvaRequest;
use App\Models\Eva;
use App\Models\Point;
use App\Models\ElementType;
use App\Models\Element;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;

class EvaController extends Controller
{
    public function index()
    {
        $evas = Eva::with(['element.point', 'element.elementType'])->get();
        return response()->json($evas);
    }

    public function create()
    {
        return response()->json(Config::get('dictionaries'));
    }

    public function show($id)
    {
        return response()->json(Eva::findOrFail($id));
    }

    public function store(EvaRequest $request)
    {
        $request->validated();

        Eva::create($request->all());
        return response()->json(['message' => 'Eva created successfully']);
    }

    public function edit($id)
    {
        return response()->json(Config::get('dictionaries'));
    }

    public function update(EvaRequest $request, $id)
    {
        $request->validated();

        $eva = Eva::findOrFail($id);
        $eva->update($request->all());
        return response()->json(['message' => 'Eva updated successfully']);
    }

    public function destroy($id)
    {
        Eva::findOrFail($id)->delete();
        return response()->json(['message' => 'Eva deleted successfully']);
    }    
}