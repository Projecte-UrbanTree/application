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
                'name' => 'Type 1',
                'description' => 'Description for Type 1',
            ],
            [
                'name' => 'Type 2',
                'description' => 'Description for Type 2',
            ],
            [
                'name' => 'Type 3',
                'description' => 'Description for Type 3',
            ],
        ]);
    }
}
