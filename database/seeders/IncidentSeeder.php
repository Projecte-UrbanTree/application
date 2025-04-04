<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class IncidentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('incidences')->insert([
            [
                'name' => 'Incident 1',
                'description' => 'Description for Incident 1',
                'status' => 'open',
                'element_id' => 1,
            ],
            [
                'name' => 'Incident 2',
                'description' => 'Description for Incident 2',
                'status' => 'in_progress',
                'element_id' => 2,
            ],
            [
                'name' => 'Incident 3',
                'description' => 'Description for Incident 3',
                'status' => 'resolved',
                'element_id' => 3,
            ],
        ]);
    }
}
