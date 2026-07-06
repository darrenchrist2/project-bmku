<?php

namespace App\Services;

use App\Models\InventoryItem;
use App\Models\InventoryTransaction;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class InventoryTransactionService
{
    /**
     * Semua transaksi.
     */
    public function getTransactions(): Collection
    {
        return InventoryTransaction::with([
            'inventoryItem',
            'branchOffice'
        ])
        ->latest('transaction_date')
        ->get();
    }

    /**
     * Detail transaksi.
     */
    public function getTransactionById(int $id): InventoryTransaction
    {
        return InventoryTransaction::with([
            'inventoryItem',
            'branchOffice'
        ])->findOrFail($id);
    }

    /**
     * Stok Masuk.
     */
    public function stockIn(array $data): InventoryTransaction
    {
        return InventoryTransaction::create([
            'item_id' => $data['item_id'],
            'transaction_date' => $data['transaction_date'],
            'transaction_type' => 'IN',
            'quantity' => $data['quantity'],
            'branch_office_id' => null,
            'note' => $data['note'] ?? null,
        ]);
    }

    /**
     * Stok Keluar.
     */
    public function stockOut(array $data): InventoryTransaction
    {
        $currentStock = $this->getCurrentStock($data['item_id']);

        if ($currentStock < $data['quantity']) {
            throw new \Exception('Stock is not sufficient.');
        }

        return InventoryTransaction::create([
            'item_id' => $data['item_id'],
            'transaction_date' => $data['transaction_date'],
            'transaction_type' => 'OUT',
            'quantity' => $data['quantity'],
            'branch_office_id' => $data['branch_office_id'],
            'note' => $data['note'] ?? null,
        ]);
    }

    /**
     * Hitung stok saat ini.
     */
    public function getCurrentStock(int $itemId): int
    {
        $stockIn = InventoryTransaction::where('item_id', $itemId)
            ->where('transaction_type', 'IN')
            ->sum('quantity');

        $stockOut = InventoryTransaction::where('item_id', $itemId)
            ->where('transaction_type', 'OUT')
            ->sum('quantity');

        return $stockIn - $stockOut;
    }

    /**
     * Laporan stok bulanan.
     */
    public function getMonthlyStockReport(
        int $year,
        int $month
    ): Collection {

        return InventoryItem::select(
                'inventory_items.id',
                'item_name',
                'item_code'
            )
            ->selectRaw("
                SUM(
                    CASE
                        WHEN inventory_transactions.transaction_type='IN'
                        THEN inventory_transactions.quantity
                        ELSE 0
                    END
                ) as total_in
            ")
            ->selectRaw("
                SUM(
                    CASE
                        WHEN inventory_transactions.transaction_type='OUT'
                        THEN inventory_transactions.quantity
                        ELSE 0
                    END
                ) as total_out
            ")
            ->leftJoin(
                'inventory_transactions',
                'inventory_items.id',
                '=',
                'inventory_transactions.item_id'
            )
            ->whereYear(
                'inventory_transactions.transaction_date',
                $year
            )
            ->whereMonth(
                'inventory_transactions.transaction_date',
                $month
            )
            ->groupBy(
                'inventory_items.id',
                'item_name',
                'item_code'
            )
            ->get();
    }

    /**
     * Pemakaian per cabang.
     */
    public function getBranchUsage(
        int $branchOfficeId,
        int $year,
        int $month
    ): Collection {

        return InventoryTransaction::with('inventoryItem')
            ->where('branch_office_id', $branchOfficeId)
            ->where('transaction_type', 'OUT')
            ->whereYear('transaction_date', $year)
            ->whereMonth('transaction_date', $month)
            ->get();
    }

    /**
     * Hapus transaksi.
     */
    public function deleteTransaction(int $id): bool
    {
        $transaction = InventoryTransaction::findOrFail($id);

        return $transaction->delete();
    }
}