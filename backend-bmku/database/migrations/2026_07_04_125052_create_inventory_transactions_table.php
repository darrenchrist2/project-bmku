<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('inventory_transactions', function (Blueprint $table) {
            $table->id();

            $table->foreignId('item_id')
                ->constrained('inventory_items')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->date('transaction_date');

            $table->enum('transaction_type', ['IN', 'OUT']);

            $table->integer('quantity');

            $table->foreignId('branch_office_id')
                ->nullable()
                ->constrained('branch_offices')
                ->cascadeOnUpdate()
                ->nullOnDelete();

            $table->string('note', 255)->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventory_transactions');
    }
};