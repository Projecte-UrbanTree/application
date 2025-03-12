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
                'report_status' => 0,
                'report_incidents' => 'Incidence for Work Report 1',
            ],
            [
                'observation' => 'Observation for Work Report 2',
                'spent_fuel' => 20.0,
                'work_order_id' => 2,
                'report_status' => 1,
                'report_incidents' => 'Incidence for Work Report 2',
            ],
            [
                'observation' => 'Observation for Work Report 3',
                'spent_fuel' => 15.75,
                'work_order_id' => 3,
                'report_status' => 2,
                'report_incidents' => 'Incidence for Work Report 3',
            ],
            [
                'observation' => 'Observation for Work Report 4',
                'spent_fuel' => 25.0,
                'work_order_id' => 4,
                'report_status' => 1,
                'report_incidents' => 'Incidence for Work Report 4',
            ],
            [
                'observation' => 'Observation for Work Report 5',
                'spent_fuel' => 30.0,
                'work_order_id' => 5,
                'report_status' => 2,
                'report_incidents' => 'Incidence for Work Report 5',
            ],
            [
                'observation' => 'Observation for Work Report 6',
                'spent_fuel' => 12.5,
                'work_order_id' => 6,
                'report_status' => 1,
                'report_incidents' => 'Incidence for Work Report 6',
            ],
            [
                'observation' => 'Observation for Work Report 7',
                'spent_fuel' => 18.0,
                'work_order_id' => 7,
                'report_status' => 3,
                'report_incidents' => 'Incidence for Work Report 7',
            ],
            [
                'observation' => 'Observation for Work Report 8',
                'spent_fuel' => 22.0,
                'work_order_id' => 8,
                'report_status' => 2,
                'report_incidents' => 'Incidence for Work Report 8',
            ],
            [
                'observation' => 'Observation for Work Report 9',
                'spent_fuel' => 28.0,
                'work_order_id' => 9,
                'report_status' => 1,
                'report_incidents' => 'Incidence for Work Report 9',
            ],
            [
                'observation' => 'Observation for Work Report 10',
                'spent_fuel' => 35.5,
                'work_order_id' => 10,
                'report_status' => 2,
                'report_incidents' => 'Incidence for Work Report 10',
            ],
        ]);
    }
}
