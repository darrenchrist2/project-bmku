<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PrinterRepair extends Model
{
    protected $fillable = [
        'repair_date',
        'branch_office_id',
        'technician_id',
        'machine_type',
        'description',
    ];

    protected $casts = [
        'repair_date' => 'date',
    ];

    public function branchOffice(): BelongsTo
    {
        return $this->belongsTo(BranchOffice::class);
    }

    public function technician(): BelongsTo
    {
        return $this->belongsTo(Technician::class);
    }

    public function repairItems(): HasMany
    {
        return $this->hasMany(RepairItem::class, 'repair_id');
    }
}