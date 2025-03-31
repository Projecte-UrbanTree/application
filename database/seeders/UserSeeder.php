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
                'name' => 'Gemma',
                'surname' => 'Palanca',
                'email' => 'admin@urbantree.com',
                'company' => 'Urban Tree 5.0',
                'dni' => '12345678A',
                'password' => Hash::make('demopass'),
                'role' => 'admin',
            ],
            [
                'name' => 'Joan',
                'surname' => 'Garcia',
                'email' => 'worker1@urbantree.com',
                'company' => 'Urban Tree 5.0',
                'dni' => '12345678B',
                'password' => Hash::make('demopass'),
                'role' => 'worker',
            ],
            [
                'name' => 'Maria',
                'surname' => 'Lopez',
                'email' => 'worker2@urbantree.com',
                'company' => 'Urban Tree 5.0',
                'dni' => '12345678C',
                'password' => Hash::make('demopass'),
                'role' => 'worker',
            ],
            [
                'name' => 'Pere',
                'surname' => 'Martinez',
                'email' => 'customer@urbantree.com',
                'company' => 'Urban Tree 5.0',
                'dni' => '12345678D',
                'password' => Hash::make('demopass'),
                'role' => 'customer',
            ],
            [
                'name' => 'Victor',
                'surname' => 'Gonzalez',
                'email' => 'cascascas@urbantere.com',
                'company' => 'Urban Tree 5.0',
                'dni' => '12345678E',
                'password' => Hash::make('demopass'),
                'role' => 'worker',
            ],
        ]);
    }
}
