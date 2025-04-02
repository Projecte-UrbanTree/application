<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Contract;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ContractController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user()->cannot('viewAny', Contract::class)) {
            abort(403);
        }

        return response()->json(Contract::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date'],
            'final_price' => ['required', 'numeric'],
            'status' => ['required', Rule::in([0, 1, 2])],
        ]);

        $validated['start_date'] = date('Y-m-d', strtotime($validated['start_date']));
        $validated['end_date'] = date('Y-m-d', strtotime($validated['end_date']));

        $contract = Contract::create($validated);

        return response()->json($contract, 201);
    }

    public function show($id)
    {
        $contract = Contract::findOrFail($id);

        return response()->json($contract);
    }

    public function update(Request $request, $id)
    {
        $contract = Contract::findOrFail($id);

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'start_date' => ['sometimes', 'date'],
            'end_date' => ['sometimes', 'date'],
            'final_price' => ['sometimes', 'numeric'],
            'status' => ['sometimes', Rule::in([0, 1, 2])],
        ]);

        if (isset($validated['start_date'])) {
            $validated['start_date'] = date('Y-m-d', strtotime($validated['start_date']));
        }
        if (isset($validated['end_date'])) {
            $validated['end_date'] = date('Y-m-d', strtotime($validated['end_date']));
        }

        $contract->update($validated);

        return response()->json($contract);
    }

    public function destroy($id)
    {
        $contract = Contract::findOrFail($id);
        $contract->delete();

        return response()->json(['message' => 'Contract deleted'], 200);
    }

    public function assignUser(Request $request, Contract $contract, User $user)
    {
        if ($user->role !== 'worker') {
            return response()->json(['error' => 'Only workers can be assigned'], 403);
        }

        $contract->workers()->syncWithoutDetaching([$user->id]);

        return response()->json(['message' => 'Worker assigned successfully']);
    }

    public function unassignUser(Contract $contract, User $user)
    {
        if (! $contract->workers()->where('user_id', $user->id)->exists()) {
            return response()->json(['error' => 'Worker not assigned to this contract'], 404);
        }

        $contract->workers()->detach($user->id);

        return response()->json(['message' => 'Worker removed successfully']);
    }
}
