<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RepairItem extends Model
{
    protected $fillable = [
        'repair_id',
        'item_id',
        'quantity',
    ];

    public function repair(): BelongsTo
    {
        return $this->belongsTo(PrinterRepair::class, 'repair_id');
    }

    public function item(): BelongsTo
    {
        return $this->belongsTo(InventoryItem::class);
    }
}