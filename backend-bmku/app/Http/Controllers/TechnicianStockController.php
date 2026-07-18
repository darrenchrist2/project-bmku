<?php

namespace App\Http\Controllers;

use App\Services\TechnicianStockService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TechnicianStockController extends Controller
{
    public function __construct(
        protected TechnicianStockService $technicianStockService
    ) {
    }

    /**
     * Display all technician stock records.
     */
    public function index(Request $request): JsonResponse
    {
        $stocks = $this->technicianStockService->getTechnicianStocks(10);

        return response()->json([
            'success' => true,
            'message' => 'Technician stock records retrieved successfully.',
            'data' => $stocks->items(),
            'pagination' => [
                'current_page' => $stocks->currentPage(),
                'last_page' => $stocks->lastPage(),
                'per_page' => $stocks->perPage(),
                'total' => $stocks->total(),
            ],
        ]);
    }

    /**
     * Store new technician stock record.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'technician_id' => 'required|exists:technicians,id',
            'item_id' => 'required|exists:inventory_items,id',
            'transaction_date' => 'required|date',
            'quantity' => 'required|integer|min:1',
            'note' => 'nullable|string|max:255',
        ]);

        $stock = $this->technicianStockService->createTechnicianStock($validated);

        return response()->json([
            'success' => true,
            'message' => 'Technician stock record created successfully.',
            'data' => $stock,
        ], 201);
    }

    /**
     * Update technician stock record.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'technician_id' => 'required|exists:technicians,id',
            'item_id' => 'required|exists:inventory_items,id',
            'transaction_date' => 'required|date',
            'quantity' => 'required|integer|min:1',
            'note' => 'nullable|string|max:255',
        ]);

        $stock = $this->technicianStockService->updateTechnicianStock(
            $id,
            $validated
        );

        return response()->json([
            'success' => true,
            'message' => 'Technician stock record updated successfully.',
            'data' => $stock,
        ]);
    }

    /**
     * Monthly technician usage report.
     */
    public function monthlyUsage(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'year' => 'required|integer|min:2000',
            'month' => 'required|integer|between:1,12',
            'page' => 'nullable|integer|min:1',
        ]);

        $report = $this->technicianStockService->getMonthlyUsage(
            $validated['year'],
            $validated['month']
        );

        return response()->json([
            'success' => true,
            'message' => 'Monthly technician usage retrieved successfully.',
            'data' => $report->items(),
            'pagination' => [
                'current_page' => $report->currentPage(),
                'last_page' => $report->lastPage(),
                'per_page' => $report->perPage(),
                'total' => $report->total(),
            ],
        ]);
    }

    /**
     * Delete technician stock record.
     */
    public function destroy(int $id): JsonResponse
    {
        $this->technicianStockService->deleteTechnicianStock($id);

        return response()->json([
            'success' => true,
            'message' => 'Technician stock record deleted successfully.',
        ]);
    }
}