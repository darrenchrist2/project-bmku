<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Technician extends Model
{
    protected $fillable = [
        'full_name',
        'phone_number',
        'account_number',
    ];

    public function technicianStocks(): HasMany
    {
        return $this->hasMany(TechnicianStock::class);
    }

    public function printerRepairs(): HasMany
    {
        return $this->hasMany(PrinterRepair::class);
    }
}