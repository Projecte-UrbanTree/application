<?php

namespace Database\Factories;

use App\Models\Contract;
use App\Models\Resource;
use App\Models\ResourceType;
use Illuminate\Database\Eloquent\Factories\Factory;

class ResourceFactory extends Factory
{
    protected $model = Resource::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'contract_id' => Contract::factory(),
            'name' => $this->faker->word,
            'description' => $this->faker->sentence,
            'resource_type_id' => ResourceType::factory(),
            'unit_name' => $this->faker->word,
            'unit_cost' => $this->faker->randomFloat(2, 1, 100),
        ];
    }
}
