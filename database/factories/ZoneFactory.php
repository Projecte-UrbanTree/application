<?php

namespace Database\Factories;

use App\Models\Contract;
use App\Models\Zone;
use Illuminate\Database\Eloquent\Factories\Factory;

class ZoneFactory extends Factory
{
    protected $model = Zone::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->word,
            'contract_id' => Contract::factory(), // Crear un contrato automáticamente si no se proporciona
        ];
    }
}
