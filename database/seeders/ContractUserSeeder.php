<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ContractUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('contract_user')->insert([
            [
                'user_id' => 2,
                'contract_id' => 1,
            ],
            [
                'user_id' => 3,
                'contract_id' => 1,
            ],
            [
                'user_id' => 5,
                'contract_id' => 2,
            ],
            [
                'user_id' => 3,
                'contract_id' => 3,
            ],
            [
                'user_id' => 3,
                'contract_id' => 2,
            ],
        ]);
    }
}
