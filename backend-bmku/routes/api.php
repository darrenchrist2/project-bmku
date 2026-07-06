<?php
use App\Http\Controllers\BranchOfficeController;
use App\Http\Controllers\TechnicianController;

Route::apiResource('branch-offices', BranchOfficeController::class);
Route::apiResource('technicians', TechnicianController::class);