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
        Schema::create('elements', function (Blueprint $table) {
            $table->id();
            $table->string('description', 255)->nullable();
            $table->foreignId('element_type_id')->constrained('element_types')->onDelete('cascade');
            $table->foreignId('tree_type_id')->nullable()->constrained('tree_types')->nullOnDelete();
            $table->foreignId('point_id')->constrained('points')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('elements');
    }
};
