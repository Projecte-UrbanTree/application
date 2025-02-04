<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class WorkReportResourceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('work_report_resources')->insert([
            [
                'resource_id' => 1,
                'work_report_id' => 1,
            ],
            [
                'resource_id' => 2,
                'work_report_id' => 2,
            ],
            [
                'resource_id' => 3,
                'work_report_id' => 3,
            ],
        ]);
    }
}
