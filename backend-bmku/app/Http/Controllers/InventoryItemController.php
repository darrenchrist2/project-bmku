<?php

namespace App\Http\Controllers;

use App\Services\InventoryItemService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InventoryItemController extends Controller
{
    public function __construct(
        protected InventoryItemService $inventoryItemService
    ) {
    }

    /**
     * Display all inventory items.
     */
    public function index(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Inventory items retrieved successfully.',
            'data' => $this->inventoryItemService->getInventoryItems(),
        ]);
    }

    /**
     * Store a new inventory item.
     */
    // public function store(Request $request): JsonResponse
    // {
    //     $validated = $request->validate([
    //         'item_code' => 'required|string|max:50|unique:inventory_items,item_code',
    //         'item_name' => 'required|string|max:150',
    //         'category' => 'required|in:SPAREPART,TONER',
    //         'unit' => 'nullable|string|max:30',
    //     ]);

    //     $inventoryItem = $this->inventoryItemService->createInventoryItem($validated);

    //     return response()->json([
    //         'success' => true,
    //         'message' => 'Inventory item created successfully.',
    //         'data' => $inventoryItem,
    //     ], 201);
    // }

    /**
     * Store a new inventory item with initial stock.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'item_code' => 'required|string|max:50|unique:inventory_items,item_code',
            'item_name' => 'required|string|max:150',
            'category' => 'required|in:SPAREPART,TONER',
            'unit' => 'nullable|string|max:30',

            // Initial stock
            'transaction_date' => 'required|date',
            'quantity' => 'required|integer|min:0',
            'note' => 'nullable|string|max:255',
        ]);

        $inventoryItem = $this->inventoryItemService
            ->createInventoryItemWithStock($validated);

        return response()->json([
            'success' => true,
            'message' => 'Inventory item created successfully with initial stock.',
            'data' => $inventoryItem,
        ], 201);
    }

    /**
     * Display a specific inventory item.
     */
    public function show(int $id): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Inventory item retrieved successfully.',
            'data' => $this->inventoryItemService->getInventoryItemById($id),
        ]);
    }

    /**
     * Update an inventory item.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            // 'item_code' => 'required|string|max:50|unique:inventory_items,item_code,' . $id,
            'item_name' => 'required|string|max:150',
            'category' => 'required|in:SPAREPART,TONER',
            // 'unit' => 'nullable|string|max:30',
        ]);

        $inventoryItem = $this->inventoryItemService->updateInventoryItem($id, $validated);

        return response()->json([
            'success' => true,
            'message' => 'Inventory item updated successfully.',
            'data' => $inventoryItem,
        ]);
    }

    /**
     * Delete an inventory item.
     */
    public function destroy(int $id): JsonResponse
    {
        $this->inventoryItemService->deleteInventoryItem($id);

        return response()->json([
            'success' => true,
            'message' => 'Inventory item deleted successfully.',
        ]);
    }
}