<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\EvaRequest;
use App\Models\Element;
use App\Models\Eva;
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
        $dictionaries = Config::get('dictionaries');

        $elements = Element::with(['elementType'])->get()->map(function ($element) {
            return [
                'id' => $element->id,
                'name' => $element->elementType->name,
            ];
        });

        return response()->json([
            'dictionaries' => $dictionaries,
            'elements' => $elements,
        ]);
    }

    public function show($id)
    {
        $eva = Eva::with(['element.point', 'element.elementType'])->findOrFail($id);

        return response()->json($eva);
    }

    public function store(EvaRequest $request)
    {
        $validatedData = $request->validated();

        Eva::create($validatedData);

        return response()->json(['message' => 'Eva created successfully']);
    }

    public function edit($id)
    {
        $data = [
            'dictionaries' => Config::get('dictionaries'),
            'eva' => Eva::with(['element.point', 'element.elementType'])->findOrFail($id),
        ];

        return response()->json($data);
    }

    public function update(EvaRequest $request, $id)
    {
        $validatedData = $request->validated();

        $eva = Eva::findOrFail($id);
        $eva->update($validatedData);

        return response()->json(['message' => 'Eva updated successfully']);
    }

    public function destroy($id)
    {
        Eva::findOrFail($id)->delete();

        return response()->json(['message' => 'Eva deleted successfully']);
    }
}
