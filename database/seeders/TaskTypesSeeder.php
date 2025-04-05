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
                'description' => 'Podar arbolat, arbustos y plantes',
            ],
            [
                'name' => 'Regar',
                'description' => 'Reg general',
            ],
            [
                'name' => 'Tractament',
                'description' => 'Tractament fitosanitari',
            ],
        ]);
    }
}
