<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
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
                'name' => 'Resource Type 1',
                'description' => 'Description for Resource Type 1',
            ],
            [
                'name' => 'Resource Type 2',
                'description' => 'Description for Resource Type 2',
            ],
            [
                'name' => 'Resource Type 3',
                'description' => 'Description for Resource Type 3',
            ],
        ]);
    }
}
