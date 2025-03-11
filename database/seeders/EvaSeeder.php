<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EvaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('eva')->insert([
            [
                'element_id' => 1,
                'date_birth' => '2025-03-11 15:40:20',
                'height' => 10.5,
                'diameter' => 0.5,
                'crown_width' => 3.2,
                'crown_projection_area' => 8.0,
                'root_surface_diameter' => 1.5,
                'effective_root_area' => 2.5,
                'height_estimation' => 11.0,
                'unbalanced_crown' => 0,
                'overextended_branches' => 1,
                'cracks' => 0,
                'dead_branches' => 2,
                'inclination' => 0,
                'V_forks' => 1,
                'cavities' => 0,
                'bark_damage' => 1,
                'soil_lifting' => 0,
                'cut_damaged_roots' => 0,
                'basal_rot' => 0,
                'exposed_surface_roots' => 1,
                'wind' => 0,
                'drought' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
