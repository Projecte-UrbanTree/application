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
        Schema::create('work_orders_blocks_zones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('work_orders_block_id')->constrained('work_orders_blocks')->onDelete('cascade');
            $table->foreignId('zone_id')->constrained('zones')->onDelete('cascade');
            $table->timestamps();
            $table->unique(['work_orders_block_id', 'zone_id'], 'UC_WorkOrderBlockZone');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('work_orders_blocks_zones');
    }
};
