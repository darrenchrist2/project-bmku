<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class InventoryItem extends Model
{
    protected $fillable = [
        'item_code',
        'item_name',
        'category',
        'unit',
    ];

    public function inventoryTransactions(): HasMany
    {
        return $this->hasMany(InventoryTransaction::class, 'item_id');
    }

    public function technicianStocks(): HasMany
    {
        return $this->hasMany(TechnicianStock::class, 'item_id');
    }

    public function repairItems(): HasMany
    {
        return $this->hasMany(RepairItem::class, 'item_id');
    }
}