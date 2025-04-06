<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            ContractSeeder::class,
            UserSeeder::class,
            ContractUserSeeder::class,
            TreeTypesSeeder::class,
            TaskTypesSeeder::class,
            ElementTypesSeeder::class,
            ZoneSeeder::class,
            PointSeeder::class,
            ElementSeeder::class,
            IncidentSeeder::class,
            ResourceTypeSeeder::class,
            ResourceSeeder::class,
            SensorSeeder::class,
            EvaSeeder::class,
        ]);
    }
}
