<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\EvaRequest;
use App\Models\Eva;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;

class EvaController extends Controller
{
    public function index()
    {
        return response()->json(Eva::all());
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

        Eva::findOrFail($id)->update($request->all());
        return response()->json(['message' => 'Eva updated successfully']);
    }

    public function destroy($id)
    {
        Eva::findOrFail($id)->delete();
        return response()->json(['message' => 'Eva deleted successfully']);
    }    
}