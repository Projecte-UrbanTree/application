<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TreeTypesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('tree_types')->insert([
            [
                'family' => 'Fagaceae',
                'genus' => 'Quercus',
                'species' => 'Quercus robur',
            ],
            [
                'family' => 'Pinaceae',
                'genus' => 'Pinus',
                'species' => 'Pinus sylvestris',
            ],
            [
                'family' => 'Betulaceae',
                'genus' => 'Betula',
                'species' => 'Betula pendula',
            ],
        ]);
    }
}
