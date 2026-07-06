<?php
use App\Http\Controllers\BranchOfficeController;
use App\Http\Controllers\TechnicianController;
use App\Http\Controllers\InventoryItemController;

Route::apiResource('branch-offices', BranchOfficeController::class);
Route::apiResource('technicians', TechnicianController::class);
Route::apiResource('inventory-items', InventoryItemController::class);