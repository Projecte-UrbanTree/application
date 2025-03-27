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
                'dev_eui' => 'a84041265185f3fc',
                'name' => 'SensorPH',
                'latitude' => 40.7093,
                'longitude' => 0.582962,
            ],
            [
                'contract_id' => 2,
                'dev_eui' => 'a840418401877546',
                'name' => 'SensorHumitat',
                'latitude' => 40.7093,
                'longitude' => 0.582962,
            ],
        ]);

        $this->command->info('Sensors table seeded successfully!'); 

        Schema::enableForeignKeyConstraints();

        $this->command->info('Sensors table seeded successfully!');
    }
}