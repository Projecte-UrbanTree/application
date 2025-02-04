<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PointSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('points')->insert([
                        [
                'latitude' => 51.5074,
                'longitude' => 0.1278,
                'type' => 'zone_delimiter',
                'zone_id' => 1,
            ],
            [
                'latitude' => 48.8566,
                'longitude' => 2.3522,
                'type' => 'element',
                'zone_id' => 2,
            ],
            [
                'latitude' => 40.7128,
                'longitude' => -74.0060,
                'type' => 'zone_delimiter',
                'zone_id' => 3,
            ],
        ]);
    }
}
