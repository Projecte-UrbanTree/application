<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PointSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('points')->insert([
            [
                'latitude' => 40.705957017151285, 
                'longitude' => 0.5819307088421274,
                'type' => 'zone_delimiter',
                'zone_id' => 1,
            ],
            
            [
                'latitude' => 40.70582831162543,
                'longitude' => 0.5844847646902142,
                'type' => 'zone_delimiter',
                'zone_id' => 1,
            ],

            [
                'latitude' => 40.70365351307243, 
                'longitude' => 0.5843657681033299,
                'type' => 'zone_delimiter',
                'zone_id' => 1,
            ],

            [
                'latitude' => 40.70368696361823,  
                'longitude' => 0.5819663392783148,
                'type' => 'zone_delimiter',
                'zone_id' => 1,
            ],
            
            
            [
                'latitude' => 40.70866070784594,
                'longitude' =>  0.5779260143620888,
                'type' => 'element',
                'zone_id' => 2,
            ],
            [
                'latitude' => 40.70858885178705,
                'longitude' => 0.5706795952178493,
                'type' => 'zone_delimiter',
                'zone_id' => 3,
            ],
        ]);
    }
}
