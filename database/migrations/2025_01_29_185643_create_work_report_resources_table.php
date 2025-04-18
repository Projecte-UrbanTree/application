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
        Schema::create('work_report_resources', function (Blueprint $table) {
            $table->id();
            $table->decimal('quantity', 10, 2);
            $table->foreignId('resource_id')->constrained('resources')->onDelete('cascade');
            $table->foreignId('work_report_id')->constrained('work_reports')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('work_report_resources');
    }
};
