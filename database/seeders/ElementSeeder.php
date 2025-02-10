<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ElementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('elements')->insert([
            [
                'description' => 'Element 1 description',
                'element_type_id' => 1,
                'tree_type_id' => 1,
                'point_id' => 1,
            ],
            [
                'description' => 'Element 2 description',
                'element_type_id' => 2,
                'tree_type_id' => 2,
                'point_id' => 2,
            ],
            [
                'description' => 'Element 3 description',
                'element_type_id' => 3,
                'tree_type_id' => null,
                'point_id' => 3,
            ],
        ]);
    }
}
