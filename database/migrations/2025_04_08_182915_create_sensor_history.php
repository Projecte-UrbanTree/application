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
        Schema::create('sensor_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sensor_id')->constrained('sensors')->onDelete('cascade');
            $table->integer('temperature_soil')->nullable();
            $table->integer('temperature_air')->nullable();
            $table->integer('ph_soil')->nullable();
            $table->integer('humidity_soil')->nullable();
            $table->integer('conductivity_soil')->nullable();
            $table->integer('batery')->nullable();
            $table->integer('signal')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sensor_history');
    }
};
