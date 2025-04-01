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
<<<<<<< HEAD:database/migrations/2025_03_13_022250_add_contract_to_resources.php
        Schema::table('resources', function (Blueprint $table) {
            if (!Schema::hasColumn('resources', 'contract_id')) {
                $table->unsignedBigInteger('contract_id')->after('id');
                $table->foreign('contract_id')->references('id')->on('contracts')->onDelete('cascade');
            }
=======
        Schema::create('contract_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('contract_id')->constrained()->onDelete('cascade');
            $table->timestamps();
>>>>>>> origin/main:database/migrations/2025_03_17_233056_create_contract_user_table.php
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
<<<<<<< HEAD:database/migrations/2025_03_13_022250_add_contract_to_resources.php
        Schema::table('resources', function (Blueprint $table) {
            if (Schema::hasColumn('resources', 'contract_id')) {
                $table->dropForeign(['contract_id']);
                $table->dropColumn('contract_id');
            }
        });
=======
        Schema::dropIfExists('contract_user');
>>>>>>> origin/main:database/migrations/2025_03_17_233056_create_contract_user_table.php
    }
};
