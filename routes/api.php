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
    
    // Rutas para el mapa accesibles para todos los roles
    Route::get('zones', [ZoneController::class, 'index']);
    Route::get('points', [PointController::class, 'index']);
    Route::get('elements', [ElementController::class, 'index']);
    Route::get('element-types', [ElementTypeController::class, 'index']);
    Route::get('tree-types', [TreeTypeController::class, 'index']);
    Route::get('points/location-contract', [PointController::class, 'getLocationContractZones']);
    Route::get('zones/{zone_id}/center-zoom', [ZoneController::class, 'getCenterZoom']);

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

        // Rutas protegidas por admin (solo crear, actualizar, borrar)
        Route::resources([
            'contracts' => ContractController::class,
            'evas' => EvaController::class,
            'resources' => ResourceController::class,
            'resource-types' => ResourceTypeController::class,
            'task-types' => TaskTypeController::class,
            'users' => UserController::class,
            'work-orders' => WorkOrderController::class,
            'work-reports' => WorkReportController::class,
            'incidents' => IncidentsController::class,
            'sensors' => SensorController::class,
        ]);
        
        // Rutas de write para los recursos del mapa (solo admin)
        Route::post('zones', [ZoneController::class, 'store']);
        Route::put('zones/{id}', [ZoneController::class, 'update']);
        Route::delete('zones/{id}', [ZoneController::class, 'destroy']);
        
        Route::post('points', [PointController::class, 'store']);
        Route::put('points/{id}', [PointController::class, 'update']);
        Route::delete('points/{id}', [PointController::class, 'destroy']);
        
        Route::post('elements', [ElementController::class, 'store']);
        Route::put('elements/{id}', [ElementController::class, 'update']);
        Route::delete('elements/{id}', [ElementController::class, 'destroy']);
        
        Route::post('element-types', [ElementTypeController::class, 'store']);
        Route::put('element-types/{id}', [ElementTypeController::class, 'update']);
        Route::delete('element-types/{id}', [ElementTypeController::class, 'destroy']);
        
        Route::post('tree-types', [TreeTypeController::class, 'store']);
        Route::put('tree-types/{id}', [TreeTypeController::class, 'update']);
        Route::delete('tree-types/{id}', [TreeTypeController::class, 'destroy']);

        Route::put('/work-orders/{id}/status', [WorkOrderController::class, 'updateStatus']);
        Route::get('/work-orders/{id}/calculate-status', [WorkOrderController::class, 'calculateStatus']);
        Route::get('/evas/element/{elementId}', [EvaController::class, 'getByElementId']);
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
        
        // Rutas para el inventario (solo lectura)
        Route::get('zones', [ZoneController::class, 'index']);
        Route::get('points', [PointController::class, 'index']);
        Route::get('elements', [ElementController::class, 'index']);
        Route::get('element-types', [ElementTypeController::class, 'index']);
        Route::get('tree-types', [TreeTypeController::class, 'index']);
        Route::get('points/location-contract', [PointController::class, 'getLocationContractZones']);
        Route::get('zones/{zone_id}/center-zoom', [ZoneController::class, 'getCenterZoom']);
    });
});
