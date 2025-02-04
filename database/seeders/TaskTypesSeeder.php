<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TaskTypesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('task_types')->insert([
            [
                'name' => 'Task 1',
                'description' => 'Task 1 description',
            ],
            [
                'name' => 'Task 2',
                'description' => 'Task 2 description',
            ],
            [
                'name' => 'Task 3',
                'description' => 'Task 3 description',
            ],
        ]);
    }
}
