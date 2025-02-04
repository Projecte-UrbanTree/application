<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class WorkOrderUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('work_order_users')->insert([
            [
                'user_id' => 1,
                'work_order_id' => 1,
            ],
            [
                'user_id' => 2,
                'work_order_id' => 2,
            ],
            [
                'user_id' => 3,
                'work_order_id' => 3,
            ],
        ]);
    }
}
