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
                'description' => 'Description for Resource 1',
                'resource_type_id' => 1,
            ],
            [
                'name' => 'Resource 2',
                'description' => 'Description for Resource 2',
                'resource_type_id' => 2,
            ],
            [
                'name' => 'Resource 3',
                'description' => 'Description for Resource 3',
                'resource_type_id' => 3,
            ],
        ]);
    }
}
