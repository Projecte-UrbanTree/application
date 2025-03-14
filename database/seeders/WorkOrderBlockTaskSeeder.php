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
                'status' => 0,
                'spent_time' => 60,
                'element_type_id' => 3,
                'tree_type_id' => 1,
                'task_type_id' => 3,
                'work_order_block_id' => 3,
            ],
            [
                'status' => 1,
                'spent_time' => 150,
                'element_type_id' => 1,
                'tree_type_id' => 2,
                'task_type_id' => 1,
                'work_order_block_id' => 4,
            ],
            [
                'status' => 0,
                'spent_time' => 80,
                'element_type_id' => 2,
                'tree_type_id' => 3,
                'task_type_id' => 2,
                'work_order_block_id' => 5,
            ],
            [
                'status' => 1,
                'spent_time' => 110,
                'element_type_id' => 3,
                'tree_type_id' => 2,
                'task_type_id' => 3,
                'work_order_block_id' => 6,
            ],
            [
                'status' => 0,
                'spent_time' => 70,
                'element_type_id' => 1,
                'tree_type_id' => 1,
                'task_type_id' => 2,
                'work_order_block_id' => 7,
            ],
            [
                'status' => 1,
                'spent_time' => 95,
                'element_type_id' => 2,
                'tree_type_id' => 2,
                'task_type_id' => 1,
                'work_order_block_id' => 8,
            ],
            [
                'status' => 1,
                'spent_time' => 130,
                'element_type_id' => 3,
                'tree_type_id' => 3,
                'task_type_id' => 2,
                'work_order_block_id' => 9,
            ],
            [
                'status' => 0,
                'spent_time' => 85,
                'element_type_id' => 1,
                'tree_type_id' => 2,
                'task_type_id' => 3,
                'work_order_block_id' => 10,
            ],
        ]);
    }
}
