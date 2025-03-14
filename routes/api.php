<?php

use App\Http\Controllers\Api\Admin\AccountController;
use App\Http\Controllers\Api\Admin\ContractController;
use App\Http\Controllers\Api\Admin\ElementTypeController;
use App\Http\Controllers\Api\Admin\ResourceController;
use App\Http\Controllers\Api\Admin\ResourceTypeController;
use App\Http\Controllers\Api\Admin\StatisticsController;
use App\Http\Controllers\Api\Admin\TaskTypeController;
use App\Http\Controllers\Api\Admin\TreeTypeController;
use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\Api\Admin\WorkOrderController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Middleware\RoleMiddleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Contract;
use App\Models\Element;
use App\Models\User;
use App\Models\WorkOrder;

Route::post('login', [AuthController::class, 'login'])->name('login');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('user', function (Request $request) {
        return $request->user();
    });

    Route::post('logout', [AuthController::class, 'logout'])->name('logout');

    Route::middleware(RoleMiddleware::class.':admin')->prefix('admin')->group(function () {
        Route::post('select-contract', [ContractController::class, 'selectContract']);
        Route::get('get-selected-contract', [ContractController::class, 'getSelectedContract']);

        Route::get('stats', function (Request $request) {
            return response()->json([
                'users' => User::count(),
                'contracts' => Contract::count(),
                'elements' => Element::count(),
                'workOrders' => WorkOrder::count(),
            ]);
        });

        Route::get('account', [AccountController::class, 'show']);
        Route::put('account', [AccountController::class, 'update']);
        Route::put('account/password', [AccountController::class, 'updatePassword']);

        Route::get('contracts', [ContractController::class, 'index']);
        Route::post('contracts', [ContractController::class, 'store']);
        Route::get('contracts/{id}', [ContractController::class, 'show']);
        Route::put('contracts/{id}', [ContractController::class, 'update']);
        Route::delete('contracts/{id}', [ContractController::class, 'destroy']);

        Route::get('work-orders', [WorkOrderController::class, 'index']);
        Route::get('element-types', [ElementTypeController::class, 'index']);

        Route::get('tree-types', [TreeTypeController::class, 'index']);
        Route::post('tree-types', [TreeTypeController::class, 'store']);
        Route::get('tree-types/{id}', [TreeTypeController::class, 'show']);
        Route::put('tree-types/{id}', [TreeTypeController::class, 'update']);
        Route::delete('tree-types/{id}', [TreeTypeController::class, 'destroy']);

        Route::get('task-types', [TaskTypeController::class, 'index']);
        Route::post('task-types', [TaskTypeController::class, 'store']);
        Route::get('task-types/{id}', [TaskTypeController::class, 'show']);
        Route::put('task-types/{id}', [TaskTypeController::class, 'update']);
        Route::delete('task-types/{id}', [TaskTypeController::class, 'destroy']);

        Route::get('resources', [ResourceController::class, 'index']);
        Route::get('resource-types', [ResourceTypeController::class, 'index']);

        Route::get('users', [UserController::class, 'index']);
        Route::post('users', [UserController::class, 'store']);
        Route::get('users/{id}', [UserController::class, 'show']);
        Route::put('users/{id}', [UserController::class, 'update']);
        Route::delete('users/{id}', [UserController::class, 'destroy']);
        // Route for stats
        Route::get('statistics', [StatisticsController::class, 'index']);

        Route::resources([
            'contracts' => ContractController::class,
            'element-types' => ElementTypeController::class,
            'resources' => ResourceController::class,
            'resource-types' => ResourceTypeController::class,
            'task-types' => TaskTypeController::class,
            'tree-types' => TreeTypeController::class,
            'users' => UserController::class,
            'work-orders' => WorkOrderController::class,
        ]);
    });
});
