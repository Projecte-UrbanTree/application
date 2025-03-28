<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class WorkReportResourceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('work_report_resources')->insert([
            [
                'quantity' => 10,
                'resource_id' => 1,
                'work_report_id' => 1,
            ],
            [
                'quantity' => 20,
                'resource_id' => 2,
                'work_report_id' => 2,
            ],
            [
                'quantity' => 30,
                'resource_id' => 3,
                'work_report_id' => 3,
            ],
        ]);
    }
}
