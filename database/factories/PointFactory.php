<?php

namespace Database\Factories;

use App\Models\Point;
use App\Models\Zone;
use Illuminate\Database\Eloquent\Factories\Factory;

class PointFactory extends Factory
{
    protected $model = Point::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'latitude' => $this->faker->latitude,
            'longitude' => $this->faker->longitude,
            'type' => 'zone_delimiter',
            'zone_id' => Zone::factory(), // Crear una zona automáticamente si no se proporciona
        ];
    }
}
