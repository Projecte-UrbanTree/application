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
                'surname' => 'Jovani',
                'email' => 'albert@urbantree.com',
                'company'=> 'Urban Tree',
                'dni'=> '12345678A',
                'password' => Hash::make('password'),
                'role' => 2,
            ],
            [
                'name' => 'Gemma',
                'surname' => 'Palanca',
                'email' => 'gemma@urbantree.com',
                'company'=> 'Urban Tree',
                'dni'=> '12345678B',
                'password' => Hash::make('password'),
                'role' => 1,
            ],
            [
                'name' => 'Jordi',
                'surname' => 'Garcia',
                'email' => 'jordi@urbantree.com',
                'company'=> 'Valencia',
                'dni'=> '12345678C',
                'password' => Hash::make('password'),
                'role' => 0,  
            ],
        ]);
    }
}