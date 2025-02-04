<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class WorkOrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('work_orders')->insert([
            [
                'name' => 'Work Order 1',
                'date' => '2025-01-29',
                'status' => '0',
                'contract_id' => 1,
            ],
            [
                'name' => 'Work Order 2',
                'date' => '2015-01-29',
                'status' => '0',
                'contract_id' => 2,
            ],
            [
                'name' => 'Work Order 3',
                'date' => '2022-01-29',
                'status' => '0',
                'contract_id' => 3,
            ],
        ]);
    }
}
