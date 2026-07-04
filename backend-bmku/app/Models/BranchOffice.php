<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BranchOffice extends Model
{
    protected $fillable = [
        'code',
        'name',
        'location',
    ];

    public function inventoryTransactions(): HasMany
    {
        return $this->hasMany(InventoryTransaction::class);
    }

    public function printerRepairs(): HasMany
    {
        return $this->hasMany(PrinterRepair::class);
    }
}