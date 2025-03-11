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
        Schema::create('eva', function (Blueprint $table) {
            $table->id();
            $table->foreignId('element_id')->nullable()->constrained('elements');
            $table->dateTime('date_birth');

            // Physical Characteristics
            $table->float('height');
            $table->float('diameter');
            $table->float('crown_width');
            $table->float('crown_projection_area');
            $table->float('root_surface_diameter');
            $table->float('effective_root_area');
            $table->float('height_estimation');

            // Crowns and Branches
            $table->integer('unbalanced_crown');
            $table->integer('overextended_branches');
            $table->integer('cracks');
            $table->integer('dead_branches');

            // Trunk
            $table->integer('inclination');
            $table->integer('V_forks');
            $table->integer('cavities');
            $table->integer('bark_damage');

            // Roots
            $table->integer('soil_lifting');
            $table->integer('cut_damaged_roots');
            $table->integer('basal_rot');
            $table->integer('exposed_surface_roots');
            $table->timestamps();

            // Wind
            $table->integer('wind');

            // Drought
            $table->integer('drought');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('eva');
    }
};
