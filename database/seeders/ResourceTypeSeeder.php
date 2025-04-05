<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ResourceTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('resource_types')->insert([
            [
                'name' => 'Podadora',
                'description' => 'Maquina per podar herba i arbusts',
            ],
            [
                'name' => 'Desbroçadora',
                'description' => 'Maquina per desbrossar',
            ],
            [
                'name' => 'Bufador',
                'description' => 'Maquina per bufar fulles',
            ],
        ]);
    }
}
