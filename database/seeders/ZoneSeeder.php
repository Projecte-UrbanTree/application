<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ZoneSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('zones')->insert([
            [
                'name' => 'Zone 1',
                'description' => 'A description for Zone 1',
                'color' => '#FF5733',
                'contract_id' => 1,
            ],
            [
                'name' => 'Zone 2',
                'description' => 'A description for Zone 2',
                'color' => '#33FF57',
                'contract_id' => 2,
            ],
            [
                'name' => 'Zone 3',
                'description' => 'A description for Zone 3',
                'color' => '#3357FF',
                'contract_id' => 3,
            ],
        ]);
    }
}
