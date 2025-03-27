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
        Schema::table('resources', function (Blueprint $table) {
            if (!Schema::hasColumn('resources', 'contract_id')) {
                $table->unsignedBigInteger('contract_id')->after('id');
                $table->foreign('contract_id')->references('id')->on('contracts')->onDelete('cascade');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('resources', function (Blueprint $table) {
            if (Schema::hasColumn('resources', 'contract_id')) {
                $table->dropForeign(['contract_id']);
                $table->dropColumn('contract_id');
            }
        });
    }
};
