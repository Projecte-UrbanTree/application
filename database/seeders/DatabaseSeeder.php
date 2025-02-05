<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            TreeTypesSeeder::class,
            TaskTypesSeeder::class,
            ElementTypesSeeder::class,
            ContractSeeder::class,
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
        ]);
    }
}
