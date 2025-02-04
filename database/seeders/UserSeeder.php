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
                'name' => 'Albert',
                'username' => 'Jovani',
                'email' => 'albert@urbantree.com',
                'company'=> 'Urban Tree',
                'dni'=> '12345678A',
                'password' => Hash::make('password'),
                'role' => 2,
            ],
            [
                'name' => 'Gemma',
                'username' => 'Palanca',
                'email' => 'gemma@urbantree.com',
                'company'=> 'Urban Tree',
                'dni'=> '12345678B',
                'password' => Hash::make('password'),
                'role' => 1,
            ],
            [
                'name' => 'Jordi',
                'username' => 'Garcia',
                'email' => 'jordi@urbantree.com',
                'company'=> 'Valencia',
                'dni'=> '12345678C',
                'password' => Hash::make('password'),
                'role' => 0,  
            ],
        ]);
    }
}