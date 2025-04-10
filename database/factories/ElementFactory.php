<?php

namespace Database\Factories;

use App\Models\Element;
use App\Models\ElementType;
use App\Models\Point;
use App\Models\TreeType;
use Illuminate\Database\Eloquent\Factories\Factory;

class ElementFactory extends Factory
{
    protected $model = Element::class;

    public function definition(): array
    {
        return [
            'description' => $this->faker->sentence,
            'element_type_id' => ElementType::factory(),
            'tree_type_id' => TreeType::factory(),
            'point_id' => Point::factory(),
        ];
    }
}
