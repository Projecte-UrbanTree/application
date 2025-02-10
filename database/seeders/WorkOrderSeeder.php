<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class WorkOrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('work_orders')->insert([
            [
                'date' => '2025-01-29',
                'status' => '0',
                'contract_id' => 1,
            ],
            [
                'date' => '2015-01-29',
                'status' => '0',
                'contract_id' => 2,
            ],
            [
                'date' => '2022-01-29',
                'status' => '0',
                'contract_id' => 3,
            ],
        ]);
    }
}
