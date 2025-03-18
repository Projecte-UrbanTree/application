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
            $table->unsignedBigInteger('contract_id'); 
            $table->string('device_eui')->unique();
            $table->string('name');
            $table->float('latitude');
            $table->float('longitude');

            $table->foreign('contract_id')->references('id')->on('contracts')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sensors', function (Blueprint $table) {
            $table->dropForeign(['contract_id']);
            $table->dropColumn(['contract_id', 'device_eui', 'name', 'latitude', 'longitude']);
        });
    }
};
