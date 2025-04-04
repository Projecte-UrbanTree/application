<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('work_order_block_tasks', function (Blueprint $table) {
            $table->id();
            $table->integer('status')->default(0);
            $table->integer('spent_time')->nullable();
            $table->foreignId('element_type_id')->constrained('element_types')->onDelete('cascade');
            $table->foreignId('tree_type_id')->nullable()->constrained('tree_types')->onDelete('set null');
            $table->foreignId('task_type_id')->constrained('task_types')->onDelete('cascade');
            $table->foreignId('work_order_block_id')->constrained('work_order_blocks')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('work_order_block_tasks');
    }
};
