<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class WorkOrderBlockZoneSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('work_order_block_zones')->insert([
            [
                'zone_id' => 1,
                'work_order_block_id' => 1,
            ],
            [
                'zone_id' => 2,
                'work_order_block_id' => 2,
            ],
            [
                'zone_id' => 3,
                'work_order_block_id' => 3,
            ],
        ]);
    }
}
