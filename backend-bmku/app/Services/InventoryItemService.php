<?php

namespace App\Services;

use App\Models\InventoryItem;
use Illuminate\Database\Eloquent\Collection;

class InventoryItemService
{
    /**
     * Get all inventory items.
     */
    public function getInventoryItems(): Collection
    {
        return InventoryItem::orderBy('item_name')->get();
    }

    /**
     * Get inventory item by ID.
     */
    public function getInventoryItemById(int $id): InventoryItem
    {
        return InventoryItem::findOrFail($id);
    }

    /**
     * Create inventory item.
     */
    public function createInventoryItem(array $data): InventoryItem
    {
        return InventoryItem::create([
            'item_code' => $data['item_code'],
            'item_name' => $data['item_name'],
            'category' => $data['category'],
            'unit' => $data['unit'] ?? 'PCS',
        ]);
    }

    /**
     * Update inventory item.
     */
    public function updateInventoryItem(int $id, array $data): InventoryItem
    {
        $inventoryItem = InventoryItem::findOrFail($id);

        $inventoryItem->update([
            'item_code' => $data['item_code'] ?? $inventoryItem->item_code,
            'item_name' => $data['item_name'] ?? $inventoryItem->item_name,
            'category' => $data['category'] ?? $inventoryItem->category,
            'unit' => $data['unit'] ?? $inventoryItem->unit,
        ]);

        return $inventoryItem->fresh();
    }

    /**
     * Delete inventory item.
     */
    public function deleteInventoryItem(int $id): bool
    {
        $inventoryItem = InventoryItem::findOrFail($id);

        return $inventoryItem->delete();
    }
}