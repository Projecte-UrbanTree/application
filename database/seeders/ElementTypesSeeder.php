<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ElementTypesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB:table('element_types')->insert([
            [
                'name' => 'Element 1',
                'requires_tree_type' => true,
                'description' => 'A description for Element 1',
                'icon' => 'icon1',
                'color' => '#FF5733',
            ],
            [
                'name' => 'Element 2',
                'requires_tree_type' => true,
                'description' => 'A description for Element 2',
                'icon' => 'icon2',
                'color' => '#33FF57',
            ],
            [
                'name' => 'Element 3',
                'requires_tree_type' => false,
                'description' => 'A description for Element 3',
                'icon' => 'icon3',
                'color' => '#3357FF',
            ],
        ]);
    }
}
