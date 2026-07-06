<?php

namespace App\Services;

use App\Models\Technician;
use Illuminate\Database\Eloquent\Collection;

class TechnicianService
{
    /**
     * Get all technicians.
     */
    public function getTechnicians(): Collection
    {
        return Technician::orderBy('full_name')->get();
    }

    /**
     * Get technician by ID.
     */
    public function getTechnicianById(int $id): Technician
    {
        return Technician::findOrFail($id);
    }

    /**
     * Create technician.
     */
    public function createTechnician(array $data): Technician
    {
        return Technician::create([
            'full_name' => $data['full_name'] ?? null,
            'phone_number' => $data['phone_number'] ?? null,
            'account_number' => $data['account_number'] ?? null,
        ]);
    }

    /**
     * Update technician.
     */
    public function updateTechnician(int $id, array $data): Technician
    {
        $technician = Technician::findOrFail($id);

        $technician->update([
            'full_name' => $data['full_name'] ?? $technician->full_name,
            'phone_number' => $data['phone_number'] ?? $technician->phone_number,
            'account_number' => $data['account_number'] ?? $technician->account_number,
        ]);

        return $technician->fresh();
    }

    /**
     * Delete technician.
     */
    public function deleteTechnician(int $id): bool
    {
        $technician = Technician::findOrFail($id);

        return $technician->delete();
    }
}