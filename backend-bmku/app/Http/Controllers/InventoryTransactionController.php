<?php

namespace App\Http\Controllers;

use App\Services\InventoryTransactionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InventoryTransactionController extends Controller
{
    public function __construct(
        protected InventoryTransactionService $inventoryTransactionService
    ) {
    }

    /**
     * Display all transactions.
     */
    public function index(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Inventory transactions retrieved successfully.',
            'data' => $this->inventoryTransactionService->getTransactions(),
        ]);
    }

    /**
     * Display transaction by ID.
     */
    public function show(int $id): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Inventory transaction retrieved successfully.',
            'data' => $this->inventoryTransactionService->getTransactionById($id),
        ]);
    }

    /**
     * Stock In.
     */
    public function stockIn(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'item_id' => 'required|exists:inventory_items,id',
            'transaction_date' => 'required|date',
            'quantity' => 'required|integer|min:1',
            'note' => 'nullable|string|max:255',
        ]);

        $transaction = $this->inventoryTransactionService->stockIn($validated);

        return response()->json([
            'success' => true,
            'message' => 'Stock added successfully.',
            'data' => $transaction,
        ], 201);
    }

    /**
     * Stock Out.
     */
    public function stockOut(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'item_id' => 'required|exists:inventory_items,id',
            'branch_office_id' => 'required|exists:branch_offices,id',
            'transaction_date' => 'required|date',
            'quantity' => 'required|integer|min:1',
            'note' => 'nullable|string|max:255',
        ]);

        try {
            $transaction = $this->inventoryTransactionService->stockOut($validated);

            return response()->json([
                'success' => true,
                'message' => 'Stock issued successfully.',
                'data' => $transaction,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Current stock by item.
     */
    public function currentStock(int $itemId): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Current stock retrieved successfully.',
            'data' => [
                'item_id' => $itemId,
                'current_stock' => $this->inventoryTransactionService->getCurrentStock($itemId),
            ],
        ]);
    }

    /**
     * Current stock of all items.
     */
    public function currentStocks(Request $request): JsonResponse
    {
        $stocks = $this->inventoryTransactionService->getCurrentStocks(5);

        return response()->json([
            'success' => true,
            'message' => 'Current stocks retrieved successfully.',
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
     * Monthly stock report.
     */
    public function monthlyReport(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'year' => 'required|integer|min:2000',
            'month' => 'required|integer|between:1,12',
            'page' => 'nullable|integer|min:1',
        ]);

        $report = $this->inventoryTransactionService->getMonthlyStockReport(
            $validated['year'],
            $validated['month']
        );

        return response()->json([
            'success' => true,
            'message' => 'Monthly stock report retrieved successfully.',
            'data' => $report->items(),
            'pagination' => [
                'current_page' => $report->currentPage(),
                'last_page' => $report->lastPage(),
                'per_page' => $report->perPage(),
                'total' => $report->total(),
            ]
        ]);
    }

    /**
     * Branch usage report.
     */
    public function branchUsage(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'branch_office_id' => 'required|exists:branch_offices,id',
            'year' => 'required|integer|min:2000',
            'month' => 'required|integer|between:1,12',
        ]);

        $result = $this->inventoryTransactionService->getBranchUsage(
            $validated['branch_office_id'],
            $validated['year'],
            $validated['month']
        );

        return response()->json([
            'success' => true,
            'message' => 'Branch usage retrieved successfully.',
            'total_quantity' => $result['total_quantity'],
            'data' => $result['data'],
        ]);
    }

    /**
     * Delete transaction.
     */
    public function destroy(int $id): JsonResponse
    {
        $this->inventoryTransactionService->deleteTransaction($id);

        return response()->json([
            'success' => true,
            'message' => 'Inventory transaction deleted successfully.',
        ]);
    }
}