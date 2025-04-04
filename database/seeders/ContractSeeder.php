<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ContractSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('contracts')->insert([
            [
                'name' => 'Ajuntament Amposta',
                'start_date' => '2025-01-29',
                'end_date' => '2025-01-29',
                'final_price' => 100.00,
                'status' => true,
            ],
            [
                'name' => 'Ajuntament Tortosa',
                'start_date' => '2025-01-29',
                'end_date' => '2025-01-29',
                'final_price' => 200.00,
                'status' => false,
            ],
            [
                'name' => 'Ajuntament Deltebre',
                'start_date' => '2025-01-29',
                'end_date' => '2025-01-29',
                'final_price' => 300.00,
                'status' => false,
            ],
        ]);
    }
}
