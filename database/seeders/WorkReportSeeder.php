<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class WorkReportSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('work_reports')->insert([
            [
                'observation' => 'Observation for Work Report 1',
                'spent_fuel' => 10.5,
                'work_order_id' => 1,
            ],
            [
                'observation' => 'Observation for Work Report 2',
                'spent_fuel' => 20.0,
                'work_order_id' => 2,
            ],
            [
                'observation' => 'Observation for Work Report 3',
                'spent_fuel' => 15.75,
                'work_order_id' => 3,
            ],
        ]);
    }
}
