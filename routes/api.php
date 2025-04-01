<?php

use App\Http\Controllers\Api\Admin\AccountController;
use App\Http\Controllers\Api\Admin\ContractController;
use App\Http\Controllers\Api\Admin\ElementTypeController;
use App\Http\Controllers\Api\Admin\EvaController;
use App\Http\Controllers\Api\Admin\ResourceController;
use App\Http\Controllers\Api\Admin\ResourceTypeController;
use App\Http\Controllers\Api\Admin\StatisticsController;
use App\Http\Controllers\Api\Admin\TaskTypeController;
use App\Http\Controllers\Api\Admin\TreeTypeController;
use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\Api\Admin\WorkOrderController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\Admin\SensorController;
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
        // Route for stats
        Route::get('element-types/icons', [ElementTypeController::class, 'icons']);
        Route::get('statistics', [StatisticsController::class, 'index']);

        Route::resources([
            'contracts' => ContractController::class,
            'element-types' => ElementTypeController::class,
            'evas' => EvaController::class,
            'resources' => ResourceController::class,
            'resource-types' => ResourceTypeController::class,
            'sensors' => SensorController::class, // Assegura que aquest endpoint està configurat correctament
            'task-types' => TaskTypeController::class,
            'tree-types' => TreeTypeController::class,
            'users' => UserController::class,
            'work-orders' => WorkOrderController::class,
        ]);

        // Rutes per a sensors
        Route::get('sensors', [SensorController::class, 'index']); // Llistar sensors
        Route::post('sensors', [SensorController::class, 'store']); // Crear sensor
        Route::get('sensors/{id}', [SensorController::class, 'show']); // Mostrar sensor
        Route::put('sensors/{id}', [SensorController::class, 'update']); // Editar sensor
        Route::delete('sensors/{id}', [SensorController::class, 'destroy']); // Eliminar sensor
        Route::get('history/{dev_eui}', [SensorController::class, 'getSensorHistoryByDevEui']);    });
});


