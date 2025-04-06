<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Contract;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WorkerController extends Controller
{
    /**
     * Display a listing of workers assigned to a contract.
     *
     * @param Contract $contract The contract model instance.
     * @return JsonResponse A JSON response containing the list of workers.
     */
    public function index(Contract $contract): JsonResponse
    {
        $workers = $contract->workers;

        return response()->json($workers);
    }

    /**
     * Assign a worker to a contract.
     *
     * @param Request $request The HTTP request instance.
     * @param Contract $contract The contract model instance.
     * @param User $user The user model instance.
     * @return JsonResponse A JSON response confirming the assignment or an error message.
     */
    public function store(Request $request, Contract $contract, User $user): JsonResponse
    {
        if ($user->role !== 'worker') {
            return response()->json(['error' => 'Only workers can be assigned'], 403);
        }

        $contract->workers()->syncWithoutDetaching([$user->id]);

        return response()->json(['message' => 'Worker assigned successfully']);
    }

    /**
     * Remove a worker from a contract.
     *
     * @param Contract $contract The contract model instance.
     * @param User $user The user model instance.
     * @return JsonResponse A JSON response confirming the removal or an error message.
     */
    public function destroy(Contract $contract, User $user): JsonResponse
    {
        if (!$contract->workers()->where('user_id', $user->id)->exists()) {
            return response()->json(['error' => 'Worker not assigned to this contract'], 404);
        }

        $contract->workers()->detach($user->id);

        return response()->json(['message' => 'Worker removed from contract']);
    }
}
