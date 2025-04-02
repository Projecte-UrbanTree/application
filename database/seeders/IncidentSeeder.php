<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class IncidentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('incidents')->insert([
            [
                'name' => 'Abre trencat',
                'description' => 'Grup de rames trencades obstaculitzant el pas',
                'status' => 'open',
                'element_id' => 1,
            ],
            [
                'name' => 'Fuga daigua',
                'description' => 'Fuga d\'aigua a la zona de reg en aspersor',
                'status' => 'in_progress',
                'element_id' => 2,
            ],
            [
                'name' => 'Arbust mort',
                'description' => 'Arbust mort als xiribecs',
                'status' => 'resolved',
                'element_id' => 3,
            ],
        ]);
    }
}
