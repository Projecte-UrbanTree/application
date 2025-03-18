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
            TreeTypesSeeder::class,
            TaskTypesSeeder::class,
            ElementTypesSeeder::class,
            ZoneSeeder::class,
            PointSeeder::class,
            ElementSeeder::class,
            IncidentSeeder::class,
            WorkOrderSeeder::class,
            WorkOrderUserSeeder::class,
            WorkOrderBlockSeeder::class,
            WorkOrderBlockZoneSeeder::class,
            WorkOrderBlockTaskSeeder::class,
            ResourceTypeSeeder::class,
            ResourceSeeder::class,
            WorkReportSeeder::class,
            WorkReportResourceSeeder::class,
            SensorSeeder::class,
            EvaSeeder::class,
        ]);
    }
}
