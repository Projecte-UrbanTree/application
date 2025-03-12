<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class WorkOrderBlockTaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('work_order_block_tasks')->insert([
            [
                'status' => 0,
                'spent_time' => 120,
                'element_type_id' => 1,
                'tree_type_id' => 1,
                'task_type_id' => 1,
                'work_order_block_id' => 1,
            ],
            [
                'status' => 1,
                'spent_time' => 90,
                'element_type_id' => 2,
                'tree_type_id' => 2,
                'task_type_id' => 2,
                'work_order_block_id' => 2,
            ],
            [
                'status' => 2,
                'spent_time' => 60,
                'element_type_id' => 3,
                'tree_type_id' => null,
                'task_type_id' => 3,
                'work_order_block_id' => 3,
            ],

        ]);
    }
}
