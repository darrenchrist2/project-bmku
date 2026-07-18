<?php

namespace App\Services;

use App\Models\TechnicianStock;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class TechnicianStockService
{
    /**
     * Semua data pengambilan stok teknisi.
     */
    public function getTechnicianStocks(
        int $perPage = 10
    ): LengthAwarePaginator {
        return TechnicianStock::with([
            'technician',
            'item'
        ])
            ->latest('transaction_date')
            ->paginate($perPage);
    }

    /**
     * Detail pengambilan.
     */
    public function getTechnicianStockById(
        int $id
    ): TechnicianStock {
        return TechnicianStock::with([
            'technician',
            'item'
        ])->findOrFail($id);
    }

    /**
     * Simpan data pengambilan.
     */
    public function createTechnicianStock(
        array $data
    ): TechnicianStock {

        return TechnicianStock::create([
            'technician_id' => $data['technician_id'],
            'item_id' => $data['item_id'],
            'transaction_date' => $data['transaction_date'],
            'quantity' => $data['quantity'],
            'note' => $data['note'] ?? null,
        ]);
    }

    /**
     * Update data pengambilan.
     */
    public function updateTechnicianStock(
        int $id,
        array $data
    ): TechnicianStock {

        $stock = TechnicianStock::findOrFail($id);

        $stock->update([
            'technician_id' => $data['technician_id'],
            'item_id' => $data['item_id'],
            'transaction_date' => $data['transaction_date'],
            'quantity' => $data['quantity'],
            'note' => $data['note'] ?? null,
        ]);

        return $stock->load([
            'technician',
            'item'
        ]);
    }

    /**
     * Hapus data pengambilan.
     */
    public function deleteTechnicianStock(
        int $id
    ): bool {

        $stock = TechnicianStock::findOrFail($id);

        return $stock->delete();
    }

    /**
     * Laporan pengambilan stok teknisi per bulan.
     *
     * Data untuk frontend:
     * - tanggal
     * - nama teknisi
     * - nama barang
     * - jumlah
     */
    public function getMonthlyUsage(
        int $year,
        int $month,
        int $perPage = 5
    ): LengthAwarePaginator {

        $technicians = TechnicianStock::select(
            'technicians.id',
            'technicians.full_name'
        )
            ->join(
                'technicians',
                'technician_stocks.technician_id',
                '=',
                'technicians.id'
            )
            ->whereYear(
                'technician_stocks.transaction_date',
                $year
            )
            ->whereMonth(
                'technician_stocks.transaction_date',
                $month
            )
            ->groupBy(
                'technicians.id',
                'technicians.full_name'
            )
            ->orderBy('technicians.full_name')
            ->paginate($perPage);

        $technicians->getCollection()->transform(function ($technician) use ($year, $month) {

            $items = TechnicianStock::select(
                'inventory_items.id as item_id',
                'inventory_items.item_name'
            )
                ->selectRaw('SUM(technician_stocks.quantity) as total_quantity')
                ->join(
                    'inventory_items',
                    'technician_stocks.item_id',
                    '=',
                    'inventory_items.id'
                )
                ->where('technician_stocks.technician_id', $technician->id)
                ->whereYear(
                    'technician_stocks.transaction_date',
                    $year
                )
                ->whereMonth(
                    'technician_stocks.transaction_date',
                    $month
                )
                ->groupBy(
                    'inventory_items.id',
                    'inventory_items.item_name'
                )
                ->orderBy('inventory_items.item_name')
                ->get();

            return [
                'technician_id' => $technician->id,
                'technician_name' => $technician->full_name,
                'items' => $items,
            ];
        });

        return $technicians;
    }
}