<?php

use App\Http\Controllers\Api\Admin\AccountController;
use App\Http\Controllers\Api\Admin\ContractController;
use App\Http\Controllers\Api\Admin\ElementController;
use App\Http\Controllers\Api\Admin\ElementTypeController;
use App\Http\Controllers\Api\Admin\EvaController;
use App\Http\Controllers\Api\Admin\IncidentsController;
use App\Http\Controllers\Api\Admin\PointController;
use App\Http\Controllers\Api\Admin\ResourceController;
use App\Http\Controllers\Api\Admin\ResourceTypeController;
use App\Http\Controllers\Api\Admin\SensorController;
use App\Http\Controllers\Api\Admin\SensorHistoryController;
use App\Http\Controllers\Api\Admin\StatisticsController;
use App\Http\Controllers\Api\Admin\TaskTypeController;
use App\Http\Controllers\Api\Admin\TreeTypeController;
use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\Api\Admin\WorkerController;
use App\Http\Controllers\Api\Admin\WorkOrderController;
use App\Http\Controllers\Api\Admin\WorkReportController;
use App\Http\Controllers\Api\Admin\ZoneController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ContractController as UserContractController;
use App\Http\Controllers\Api\Worker\IndexController;
use App\Http\Controllers\Api\Worker\ResourceController as WorkerResourceController;
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
    Route::get('contracts', [UserContractController::class, 'index']);

    /* Admin protected routes */
    Route::middleware(RoleMiddleware::class.':admin')->prefix('admin')->group(function () {
        Route::post('contracts/{id}/duplicate', [ContractController::class, 'duplicate']);

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
        Route::get('account/tokens', [AccountController::class, 'listTokens']);
        Route::delete('account/tokens/{id}', [AccountController::class, 'revokeToken']);

        Route::get('element-types/icons', [ElementTypeController::class, 'icons']);
        Route::get('statistics', [StatisticsController::class, 'index']);

        Route::get('contracts/{contract}/users', [WorkerController::class, 'index']);
        Route::post('contracts/{contract}/users/{user}', [WorkerController::class, 'store']);
        Route::delete('contracts/{contract}/users/{user}', [WorkerController::class, 'destroy']);

        Route::resources([
            'contracts' => ContractController::class,
            'elements' => ElementController::class,
            'element-types' => ElementTypeController::class,
            'evas' => EvaController::class,
            'points' => PointController::class,
            'resources' => ResourceController::class,
            'resource-types' => ResourceTypeController::class,
            'task-types' => TaskTypeController::class,
            'tree-types' => TreeTypeController::class,
            'users' => UserController::class,
            'work-orders' => WorkOrderController::class,
            'work-reports' => WorkReportController::class,
            'zones' => ZoneController::class,
            'incidents' => IncidentsController::class,
            'sensors' => SensorController::class,
        ]);

        Route::put('/work-orders/{id}/status', [WorkOrderController::class, 'updateStatus']);

        Route::get('/work-orders/{id}/calculate-status', [WorkOrderController::class, 'calculateStatus']);

        Route::get('/evas/element/{elementId}', [EvaController::class, 'getByElementId']);

        Route::get('points/location-contract', [PointController::class, 'getLocationContractZones']);

        Route::get('zones/{zone_id}/center-zoom', [ZoneController::class, 'getCenterZoom']);

        Route::put('zones/{id}/inline-update', [ZoneController::class, 'inlineUpdate']);

        Route::get('/sensorshistory', [SensorController::class, 'fetchSensors']);
        Route::get('/sensors/{eui}/history', [SensorController::class, 'fetchSensorByEUI']);
        Route::get('/sensors/{eui}/history/paginated', [SensorController::class, 'fetchAllHistorySensorbyEUI']);
        Route::get('/sensors/{eui}/fetch-and-store', [SensorHistoryController::class, 'fetchAndStoreSensorData']);
    });

    /* Worker protected routes */
    Route::middleware(RoleMiddleware::class.':worker')->prefix('worker')->group(function () {
        Route::get('work-orders', [IndexController::class, 'index']);
        Route::put('task/{taskId}/status', [IndexController::class, 'updateTaskStatus']);
        Route::get('resource-types', [WorkerResourceController::class, 'resourceTypes']);
        Route::get('resources', [WorkerResourceController::class, 'resources']);
        Route::post('work-reports', [IndexController::class, 'createWorkReport']);
    });
});
