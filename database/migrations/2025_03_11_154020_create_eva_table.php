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
            $table->foreignId('element_id')->constrained('elements');
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

            // Result
            $table->string('status')->default('0');
            
            // Wind
            $table->integer('wind');

            // Drought
            $table->integer('drought');

            $table->timestamps();
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
