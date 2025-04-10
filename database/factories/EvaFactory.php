<?php

namespace Database\Factories;

use App\Models\Eva;
use App\Models\Element;
use Illuminate\Database\Eloquent\Factories\Factory;

class EvaFactory extends Factory
{
    protected $model = Eva::class;

    public function definition(): array
    {
        return [
            'element_id' => Element::factory(),
            'date_birth' => $this->faker->date(),
            'height' => $this->faker->randomFloat(2, 1, 20),
            'diameter' => $this->faker->randomFloat(2, 0.5, 5),
            'crown_width' => $this->faker->randomFloat(2, 1, 10),
            'crown_projection_area' => $this->faker->randomFloat(2, 1, 50),
            'root_surface_diameter' => $this->faker->randomFloat(2, 0.5, 5),
            'effective_root_area' => $this->faker->randomFloat(2, 1, 30),
            'height_estimation' => $this->faker->randomFloat(2, 1, 25),
            'unbalanced_crown' => $this->faker->randomElement([0, 1]),
            'overextended_branches' => $this->faker->randomElement([0, 1]),
            'cracks' => $this->faker->randomElement([0, 1]),
            'dead_branches' => $this->faker->randomElement([0, 1]),
            'inclination' => $this->faker->randomElement([0, 1]),
            'V_forks' => $this->faker->randomElement([0, 1]),
            'cavities' => $this->faker->randomElement([0, 1]),
            'bark_damage' => $this->faker->randomElement([0, 1]),
            'soil_lifting' => $this->faker->randomElement([0, 1]),
            'cut_damaged_roots' => $this->faker->randomElement([0, 1]),
            'basal_rot' => $this->faker->randomElement([0, 1]),
            'exposed_surface_roots' => $this->faker->randomElement([0, 1]),
            'wind' => $this->faker->randomElement([0, 1]),
            'drought' => $this->faker->randomElement([0, 1]),
            'status' => $this->faker->randomElement([0, 1, 2]),
        ];
    }
}
