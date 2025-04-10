<?php

namespace Database\Factories;

use App\Models\TreeType;
use Illuminate\Database\Eloquent\Factories\Factory;

class TreeTypeFactory extends Factory
{
    protected $model = TreeType::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'family' => $this->faker->word,
            'genus' => $this->faker->word,
            'species' => $this->faker->optional()->word,
        ];
    }
}
