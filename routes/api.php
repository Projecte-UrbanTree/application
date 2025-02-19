<?php

use App\Http\Controllers\Api\Admin\ContractController;
use App\Http\Controllers\Api\Admin\ElementTypeController;
use App\Http\Controllers\Api\Admin\ResourceController;
use App\Http\Controllers\Api\Admin\ResourceTypeController;
use App\Http\Controllers\Api\Admin\TaskTypeController;
use App\Http\Controllers\Api\Admin\TreeTypeController;
use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\Api\Admin\WorkOrderController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Middleware\RoleMiddleware;
use App\Models\Contract;
use App\Models\Element;
use App\Models\User;
use App\Models\WorkOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('login', [AuthController::class, 'login'])->name('login');

Route::middleware('auth:sanctum')->group(function () {
    /* Generic protected routes */
    Route::get('user', function (Request $request) {
        return $request->user();
    });
    Route::post('logout', [AuthController::class, 'logout'])->name('logout');

    /* Admin protected routes */
    Route::middleware(RoleMiddleware::class . ':admin')->prefix('admin')->group(function () {
        Route::get('stats', function (Request $request) {
            return response()->json([
                'users' => User::count(),
                'contracts' => Contract::count(),
                'elements' => Element::count(),
                'workOrders' => WorkOrder::count(),
            ]);
        });
        Route::get('contracts', [ContractController::class, 'index']);
        Route::get('work-orders', [WorkOrderController::class, 'index']);
        Route::get('element-types', [ElementTypeController::class, 'index']);
        Route::get('tree-types', [TreeTypeController::class, 'index']);
        Route::get('task-types', [TaskTypeController::class, 'index']);
        Route::get('resources', [ResourceController::class, 'index']);
        Route::get('resource-types', [ResourceTypeController::class, 'index']);
        Route::get('users', [UserController::class, 'index']);
    });
});
