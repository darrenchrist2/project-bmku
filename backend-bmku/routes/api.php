<?php
use App\Http\Controllers\BranchOfficeController;
use App\Http\Controllers\TechnicianController;
use App\Http\Controllers\InventoryItemController;
use App\Http\Controllers\InventoryTransactionController;

// master data route
Route::apiResource('branch-offices', BranchOfficeController::class);
Route::apiResource('technicians', TechnicianController::class);
Route::apiResource('inventory-items', InventoryItemController::class);

// inventory transaction route
Route::prefix('inventory-transactions')->group(function () {

    Route::get('/', [InventoryTransactionController::class, 'index']);

    Route::post('/stock-in', [InventoryTransactionController::class, 'stockIn']);
    Route::post('/stock-out', [InventoryTransactionController::class, 'stockOut']);

    Route::get('/current-stock/{itemId}', [InventoryTransactionController::class, 'currentStock']);

    Route::get('/monthly-report', [InventoryTransactionController::class, 'monthlyReport']);

    Route::get('/branch-usage', [InventoryTransactionController::class, 'branchUsage']);

    Route::get('/{id}', [InventoryTransactionController::class, 'show'])
        ->whereNumber('id');

    Route::delete('/{id}', [InventoryTransactionController::class, 'destroy'])
        ->whereNumber('id');
});