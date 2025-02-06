<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SensorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('sensors')->insert([
            [
                'contract_id' => 1,
            ],
            [
                'contract_id' => 2,
            ],
            [
                'contract_id' => 3,
            ],
        ]);
    }
}
