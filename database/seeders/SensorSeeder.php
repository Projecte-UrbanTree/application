<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SensorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('sensors')->insert([
            [
                'eui' => 'a84041265185f3fc',
                'contract_id' => 1,
                'name' => 'Sensor 1',
                'longitude' => '12.345678',
                'latitude' => '-98.765432',
            ],
            [
                'eui' => 'a840418401877546',
                'contract_id' => 2,
                'name' => 'Sensor 2',
                'longitude' => '23.456789',
                'latitude' => '-87.654321',
            ],
            [
                'eui' => 'GHI567890123',
                'contract_id' => 3,
                'name' => 'Sensor 3',
                'longitude' => '34.567890',
                'latitude' => '-76.543210',
            ],
        ]);
    }
}
