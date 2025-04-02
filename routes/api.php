<?php

use App\Http\Controllers\Api\Admin\ContractController;
use App\Http\Controllers\Api\Admin\ElementController;
use App\Http\Controllers\Api\Admin\ElementTypeController;
use App\Http\Controllers\Api\Admin\EvaController;
use App\Http\Controllers\Api\Admin\IncidentsController;
use App\Http\Controllers\Api\Admin\PointController;
use App\Http\Controllers\Api\Admin\ResourceController;
use App\Http\Controllers\Api\Admin\ResourceTypeController;
use App\Http\Controllers\Api\Admin\StatisticsController;
use App\Http\Controllers\Api\Admin\TaskTypeController;
use App\Http\Controllers\Api\Admin\TreeTypeController;
use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\Api\Admin\WorkReportController;
use App\Http\Controllers\Api\Admin\ZoneController;
use App\Http\Controllers\Api\Shared\AccountController;
use App\Http\Controllers\Api\Shared\AuthController;
use App\Http\Controllers\Api\Shared\WorkOrderController;
use App\Http\Middleware\RoleMiddleware;
use Illuminate\Support\Facades\Route;

Route::post('login', [AuthController::class, 'login'])->name('login');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('logout', [AuthController::class, 'logout'])->name('logout');

    Route::singleton('me', AccountController::class);

    Route::middleware(RoleMiddleware::class . ':worker')->group(function () {
        Route::apiResource('work-orders', WorkOrderController::class)->only(['index', 'show', 'update']);
        Route::post('work-orders/toggle-task/{taskId}', [WorkOrderController::class, 'toggleTask']);
        Route::post('work-orders/store-report', [WorkOrderController::class, 'storeReport']);
    });

    /* Admin protected routes */
    Route::middleware(RoleMiddleware::class . ':admin')->prefix('admin')->group(function () {
        Route::get('workers', [UserController::class, 'workers']);

        Route::get('element-types/icons', [ElementTypeController::class, 'icons']);
        Route::get('statistics/metrics', [StatisticsController::class, 'metrics']);
        Route::get('statistics', [StatisticsController::class, 'index']);

        Route::put('me/password', [AccountController::class, 'updatePassword']);

        Route::post('contracts/{contract}/users/{user}', [ContractController::class, 'assignUser']);
        Route::delete('contracts/{contract}/users/{user}', [ContractController::class, 'unassignUser']);

        Route::put('work-orders/{id}/status', [WorkOrderController::class, 'updateStatus']);

        Route::resources([
            'contracts' => ContractController::class,
            'elements' => ElementController::class,
            'element-types' => ElementTypeController::class,
            'evas' => EvaController::class,
            'incidents' => IncidentsController::class,
            'points' => PointController::class,
            'resources' => ResourceController::class,
            'resource-types' => ResourceTypeController::class,
            'task-types' => TaskTypeController::class,
            'tree-types' => TreeTypeController::class,
            'users' => UserController::class,
            'work-orders' => WorkOrderController::class,
            'work-reports' => WorkReportController::class,
            'zones' => ZoneController::class,
        ]);
    });
});
