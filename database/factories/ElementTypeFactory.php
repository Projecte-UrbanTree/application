<?php

namespace Database\Factories;

use App\Models\ElementType;
use Illuminate\Database\Eloquent\Factories\Factory;

class ElementTypeFactory extends Factory
{
    protected $model = ElementType::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->word,
            'requires_tree_type' => $this->faker->boolean,
            'description' => $this->faker->sentence,
            'icon' => $this->faker->randomElement(['tree', 'home', 'park', 'fountain']),
            'color' => $this->faker->hexColor,
        ];
    }
}
