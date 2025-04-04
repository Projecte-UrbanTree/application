<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TaskTypesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('task_types')->insert([
            [
                'name' => 'Podar',
                'description' => 'Task 1 description',
            ],
            [
                'name' => 'Regar',
                'description' => 'Task 2 description',
            ],
            [
                'name' => 'Cortar',
                'description' => 'Task 3 description',
            ],
        ]);
    }
}
