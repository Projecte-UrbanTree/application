<?php

namespace Database\Seeders;

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
                'report_status' => 1,
                'report_incidence' => 'Incidence for Work Report 1',
            ],
            [
                'observation' => 'Observation for Work Report 2',
                'spent_fuel' => 20.0,
                'work_order_id' => 2,
                'report_status' => 2,
                'report_incidence' => 'Incidence for Work Report 2',
            ],
            [
                'observation' => 'Observation for Work Report 3',
                'spent_fuel' => 15.75,
                'work_order_id' => 3,
                'report_status' => 3,
                'report_incidence' => 'Incidence for Work Report 3',
            ],
        ]);
    }
}
