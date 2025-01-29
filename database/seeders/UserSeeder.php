<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('users')->insert([
            [
                'name' => 'Administrator',
                'email' => 'admin@urbantree.com',
                'password' => Hash::make('password'),
            ],
            [
                'name' => 'Worker',
                'email' => 'worker@urbantree.com',
                'password' => Hash::make('password'),
            ],
            [
                'name' => 'Customer',
                'email' => 'customer@urbantree.com',
                'password' => Hash::make('password'),
            ],
        ]);
    }
}
