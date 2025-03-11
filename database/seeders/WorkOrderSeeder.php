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
            [
                'date' => '2025-03-15',
                'status' => '1',
                'contract_id' => 1,
            ],
            [
                'date' => '2025-2-03',
                'status' => '1',
                'contract_id' => 2,
            ],
            [
                'date' => '2025-03-19',
                'status' => '0',
                'contract_id' => 2,
            ],
            [
                'date' => '2021-03-12',
                'status' => '1',
                'contract_id' => 2,
            ],
            [
                'date' => '2020-03-07',
                'status' => '2',
                'contract_id' => 2,
            ],
            [
                'date' => '2024-02-19',
                'status' => '0',
                'contract_id' => 2,
            ],
            [
                'date' => '2021-03-28',
                'status' => '1',
                'contract_id' => 2,
            ],

        ]);

    }
}
