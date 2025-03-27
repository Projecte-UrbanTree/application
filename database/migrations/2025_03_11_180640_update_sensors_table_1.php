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
        Schema::table('sensors', function (Blueprint $table) {
            if (!Schema::hasColumn('sensors', 'contract_id')) {
                $table->unsignedBigInteger('contract_id');
                $table->foreign('contract_id')->references('id')->on('contracts')->onDelete('cascade');
            }
            if (!Schema::hasColumn('sensors', 'dev_eui')) { // Cambiado de 'device_eui' a 'dev_eui'
                $table->string('dev_eui')->nullable()->unique(); // Permitir valores nulos
            }
            if (!Schema::hasColumn('sensors', 'name')) {
                $table->string('name');
            }
            if (!Schema::hasColumn('sensors', 'latitude')) {
                $table->float('latitude');
            }
            if (!Schema::hasColumn('sensors', 'longitude')) {
                $table->float('longitude');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sensors', function (Blueprint $table) {
            if (Schema::hasColumn('sensors', 'contract_id')) {
                $table->dropForeign(['contract_id']);
                $table->dropColumn('contract_id');
            }
            if (Schema::hasColumn('sensors', 'dev_eui')) { // Cambiado de 'device_eui' a 'dev_eui'
                $table->dropUnique(['dev_eui']); // Elimina el índice único
                $table->dropColumn('dev_eui');  // Luego elimina la columna
            }
            if (Schema::hasColumn('sensors', 'name')) {
                $table->dropColumn('name');
            }
            if (Schema::hasColumn('sensors', 'latitude')) {
                $table->dropColumn('latitude');
            }
            if (Schema::hasColumn('sensors', 'longitude')) {
                $table->dropColumn('longitude');
            }
        });
    }
};
