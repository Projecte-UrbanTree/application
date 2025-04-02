<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ZoneSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('zones')->insert([
            [
                'name' => 'Parc dels Xiribecs',
                'description' => '',
                'color' => '#FF5733',
                'contract_id' => 1,
            ],
            [
                'name' => 'Parc Municipal de amposta',
                'description' => 'A description for Zone 2',
                'color' => '#33FF57',
                'contract_id' => 2,
            ],
            [
                'name' => 'Cementeri de amposta',
                'description' => 'A description for Zone 3',
                'color' => '#3357FF',
                'contract_id' => 3,
            ],
        ]);
    }
}
