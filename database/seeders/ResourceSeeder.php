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
                'unit_name' => 'Gasolina',
                'unit_cost' => 10.5,

            ],
            [
                'name' => 'Resource 2',
                'contract_id' => 2,
                'description' => 'Description for Resource 2',
                'resource_type_id' => 2,
                'unit_name' => 'Hores',
                'unit_cost' => 20.5,

            ],  
            [
                'name' => 'Resource 3',
                'contract_id' => 3,
                'description' => 'Description for Resource 3',
                'resource_type_id' => 3,
                'unit_name' => 'Gasolina',
                'unit_cost' => 10.5,

            ],
            [
                'name' => 'Resource 4',
                'contract_id' => 3,
                'description' => 'Description for Resource 4',
                'resource_type_id' => 1,
                'unit_name' => 'Litres',
                'unit_cost' => 15.0,
            ],
            [
                'name' => 'Resource 5',
                'contract_id' => 3,
                'description' => 'Description for Resource 5',
                'resource_type_id' => 2,
                'unit_name' => 'Metres',
                'unit_cost' => 12.0,
            ],
            [
                'name' => 'Resource 6',
                'contract_id' => 3,
                'description' => 'Description for Resource 6',
                'resource_type_id' => 3,
                'unit_name' => 'Kilograms',
                'unit_cost' => 18.5,
            ],
        ]);
    }
}
