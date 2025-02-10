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
        ]);
    }
}
