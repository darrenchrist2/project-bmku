<?php

namespace App\Services;

use App\Models\BranchOffice;
use Illuminate\Database\Eloquent\Collection;

class BranchOfficeService
{
    /**
     * Get all branch offices.
     */
    public function getBranchOffices(): Collection
    {
        return BranchOffice::orderBy('name')->get();
    }

    /**
     * Get branch office by ID.
     */
    public function getBranchOfficeById(int $id): BranchOffice
    {
        return BranchOffice::findOrFail($id);
    }

    /**
     * Create new branch office.
     */
    public function createBranchOffice(array $data): BranchOffice
    {
        return BranchOffice::create([
            'code' => $data['code'] ?? null,
            'name' => $data['name'] ?? null,
            'location' => $data['location'] ?? null,
        ]);
    }

    /**
     * Update branch office.
     */
    public function updateBranchOffice(int $id, array $data): BranchOffice
    {
        $branchOffice = BranchOffice::findOrFail($id);

        $branchOffice->update([
            'code' => $data['code'] ?? $branchOffice->code,
            'name' => $data['name'] ?? $branchOffice->name,
            'location' => $data['location'] ?? $branchOffice->location,
        ]);

        return $branchOffice->fresh();
    }

    /**
     * Delete branch office.
     */
    public function deleteBranchOffice(int $id): bool
    {
        $branchOffice = BranchOffice::findOrFail($id);

        return $branchOffice->delete();
    }
}