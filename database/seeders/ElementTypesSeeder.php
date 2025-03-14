<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ElementTypesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('element_types')->insert([
            [
                'name' => 'Arbol',
                'requires_tree_type' => true,
                'description' => 'A description for Element 1',
                'icon' => 'icon1',
                'color' => 'FF5733',
            ],
            [
                'name' => 'Naranjo',
                'requires_tree_type' => true,
                'description' => 'A description for Element 2',
                'icon' => 'icon2',
                'color' => '33FF57',
            ],
            [
                'name' => 'Pino',
                'requires_tree_type' => false,
                'description' => 'A description for Element 3',
                'icon' => 'icon3',
                'color' => '3357FF',
            ],
        ]);
    }
}
