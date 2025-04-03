<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PointSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('points')->insert([
            [
                'latitude' => 40.705957017151285, 
                'longitude' => 0.5819307088421274,
                'type' => 'zone_delimiter',
                'zone_id' => 1,
            ],
            
            [
                'latitude' => 40.70582831162543,
                'longitude' => 0.5844847646902142,
                'type' => 'zone_delimiter',
                'zone_id' => 1,
            ],

            [
                'latitude' => 40.70365351307243, 
                'longitude' => 0.5843657681033299,
                'type' => 'zone_delimiter',
                'zone_id' => 1,
            ],

            [
                'latitude' => 40.70368696361823,  
                'longitude' => 0.5819663392783148,
                'type' => 'zone_delimiter',
                'zone_id' => 1,
            ],
            



            //Zona Parc Municipal de amposta
            
            [
                'latitude' => 40.70866492137048, 
                'longitude' =>  0.5779510431027762,
                'type' => 'zone_delimiter',
                'zone_id' => 3,
            ],
            [
                'latitude' => 40.70922985094096, 0.5779953158264584,
                'longitude' =>  0.5779953158264584,
                'type' => 'zone_delimiter',
                'zone_id' => 3,
            ],
            [
                'latitude' => 40.70927086874241,
                'longitude' =>   0.5772279217730589,
                'type' => 'zone_delimiter',
                'zone_id' => 3,
            ],
            [
                'latitude' => 40.7087033188535,
                'longitude' =>   0.5771575098682329,
                'type' => 'zone_delimiter',
                'zone_id' => 2,
            ],
            
            
            
            //Cementerix
            
            [
                'latitude' => 40.70859198725073, 
                'longitude' => 0.5706877205909249,
                'type' => 'zone_delimiter',
                'zone_id' => 2,
            ],
            [
                'latitude' => 40.70898032969325, 
                'longitude' => 0.5713032875466113,
                'type' => 'zone_delimiter',
                'zone_id' => 2,
            ],
            [
                'latitude' => 40.7115173970029, 
                'longitude' => 0.5687974544757909,
                'type' => 'zone_delimiter',
                'zone_id' => 2,
            ],

            [
                'latitude' => 40.71096247780084, 
                'longitude' =>  0.5681487890008956,
                'type' => 'zone_delimiter',
                'zone_id' => 2,
            ],

            
        ]);
    }
}
