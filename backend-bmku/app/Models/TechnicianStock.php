<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TechnicianStock extends Model
{
    protected $fillable = [
        'technician_id',
        'item_id',
        'transaction_date',
        'quantity',
        'note',
    ];

    protected $casts = [
        'transaction_date' => 'date',
    ];

    public function technician(): BelongsTo
    {
        return $this->belongsTo(Technician::class);
    }

    public function item(): BelongsTo
    {
        return $this->belongsTo(InventoryItem::class);
    }
}