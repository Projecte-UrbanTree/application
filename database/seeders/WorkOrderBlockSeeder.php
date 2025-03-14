<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class WorkOrderBlockSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('work_order_blocks')->insert([
            [
                'notes' => 'Notes for Work Order Block 1',
                'work_order_id' => 1,
            ],
            [
                'notes' => 'Notes for Work Order Block 2',
                'work_order_id' => 2,
            ],
            [
                'notes' => 'Notes for Work Order Block 3',
                'work_order_id' => 3,
            ],
            [
                'notes' => 'Notes for Work Order Block 4',
                'work_order_id' => 4,
            ],
            [
                'notes' => 'Notes for Work Order Block 5',
                'work_order_id' => 5,
            ],
            [
                'notes' => 'Notes for Work Order Block 6',
                'work_order_id' => 6,
            ],
            [
                'notes' => 'Notes for Work Order Block 7',
                'work_order_id' => 7,
            ],
            [
                'notes' => 'Notes for Work Order Block 8',
                'work_order_id' => 8,
            ],
            [
                'notes' => 'Notes for Work Order Block 9',
                'work_order_id' => 9,
            ],
            [
                'notes' => 'Notes for Work Order Block 10',
                'work_order_id' => 10,
            ],
        ]);
    }
}
