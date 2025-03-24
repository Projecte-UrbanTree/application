<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ResourceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('resources')->insert([
            [
                'name' => 'Resource 1',
                'contract_id' => 1,
                'description' => 'Description for Resource 1',
                'resource_type_id' => 1,
                'unit_type' => 'Gasolina',
                'unit_price' => 10.5,

            ],
            [
                'name' => 'Resource 2',
                'contract_id' => 2,
                'description' => 'Description for Resource 2',
                'resource_type_id' => 2,
                'unit_type' => 'Hores',
                'unit_price' => 20.5,

            ],
            [
                'name' => 'Resource 3',
                'contract_id' => 3,
                'description' => 'Description for Resource 3',
                'resource_type_id' => 3,
                'unit_type' => 'Gasolina',
                'unit_price' => 10.5,

            ],

        ]);
    }
}
