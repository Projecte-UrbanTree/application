<?php

namespace Database\Factories;

use App\Models\ResourceType;
use Illuminate\Database\Eloquent\Factories\Factory;

class ResourceTypeFactory extends Factory
{
    protected $model = ResourceType::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->word,
            'description' => $this->faker->sentence,
        ];
    }
}
