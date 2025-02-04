<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ContractSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('contracts')->insert([
            [
                'name' => 'Contract 1',
                'start_date' => '2025-01-29',
                'end_date' => '2025-01-29',
                'invoice_proposed' => 100.00,
                'invoice_agreed' => 100.00,
                'invoice_paid' => 100.00,
            ],
            [
                'name' => 'Contract 2',
                'start_date' => '2025-01-29',
                'end_date' => '2025-01-29',
                'invoice_proposed' => 200.00,
                'invoice_agreed' => 200.00,
                'invoice_paid' => 200.00,
            ],
            [
                'name' => 'Contract 3',
                'start_date' => '2025-01-29',
                'end_date' => '2025-01-29',
                'invoice_proposed' => 300.00,
                'invoice_agreed' => 300.00,
                'invoice_paid' => 300.00,
            ],
        ]);
       
    }
}
