<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class SensorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Schema::disableForeignKeyConstraints();

        DB::table('sensors')->truncate(); 

        DB::table('sensors')->insert([
            [
                'contract_id' => 1,
                'device_eui' => 'ABC123',
                'name' => 'Sensor 1',
                'latitude' => 40.7128,
                'longitude' => -74.0060,
            ],
            [
                'contract_id' => 2,
                'device_eui' => 'DEF456',
                'name' => 'Sensor 2',
                'latitude' => 34.0522,
                'longitude' => -118.2437,
            ],
            [
                'contract_id' => 3,
                'device_eui' => 'GHI789',
                'name' => 'Sensor 3',
                'latitude' => 51.5074,
                'longitude' => -0.1278,
            ],
        ]);

        $this->command->info('Sensors table seeded successfully!'); 

        Schema::enableForeignKeyConstraints();

        $this->command->info('Sensors table seeded successfully!');
    }
}