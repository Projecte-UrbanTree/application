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
                'name' => 'Parc Municipal de Amposta',
                'description' => 'A description for Zone 2',
                'color' => '#33FF57',
                'contract_id' => 1,
            ],
            [
                'name' => 'Cementeri de Amposta',
                'description' => 'A description for Zone 3',
                'color' => '#3357FF',
                'contract_id' => 1,
            ],
            [
                'name' => 'Parc municipal teodor Gonazalez',
                'description' => 'A description for Zone 3',
                'color' => '#3357FF',
                'contract_id' => 2,
            ],

            [
                'name' => 'Plaça de Alfons XVI',
                'description' => 'A description for Zone 3',
                'color' => '#FF5733',
                'contract_id' => 2,
            ],

            [
                'name' => 'Cementerio Municipal de Deltebre.',
                'description' => 'A description for Zone 3',
                'color' => '#FF5733',
                'contract_id' => 3,
            ],
        ]);
    }
}
