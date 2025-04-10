<?php

namespace Tests\Feature\Admin;

use App\Models\Contract;
use App\Models\Point;
use App\Models\User;
use App\Models\Zone;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

/**
 * Class PointTest
 *
 * Tests for admin point management functionality.
 */
class PointTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that an admin can create points.
     *
     * @return void
     */
    public function test_it_can_create_points()
    {
        Sanctum::actingAs(User::factory()->admin()->create());

        // Crear un contrato y una zona para asociar los puntos
        $contract = Contract::factory()->create();
        $zone = Zone::factory()->create(['contract_id' => $contract->id]);

        $pointData = [
            [
                'latitude' => 40.7128,
                'longitude' => -74.0060,
                'type' => 'zone_delimiter',
                'zone_id' => $zone->id,
            ],
            [
                'latitude' => 34.0522,
                'longitude' => -118.2437,
                'type' => 'zone_delimiter',
                'zone_id' => $zone->id,
            ],
        ];

        $response = $this->postJson('/api/admin/points', $pointData);

        $response->assertStatus(201)
            ->assertJsonCount(2);

        foreach ($pointData as $data) {
            $this->assertDatabaseHas('points', $data);
        }
    }

    /**
     * Test that an admin can delete points by zone.
     *
     * @return void
     */
    public function test_it_can_delete_points_by_zone()
    {
        Sanctum::actingAs(User::factory()->admin()->create());

        // Crear un contrato y una zona para asociar los puntos
        $contract = Contract::factory()->create();
        $zone = Zone::factory()->create(['contract_id' => $contract->id]);

        $points = Point::factory()->count(3)->create([
            'zone_id' => $zone->id,
            'type' => 'zone_delimiter',
        ]);

        $response = $this->deleteJson("/api/admin/points/{$zone->id}");

        $response->assertStatus(200)
            ->assertJson(['message' => 'Todos los puntos de la zona han sido eliminados correctamente.']);

        foreach ($points as $point) {
            $this->assertDatabaseMissing('points', ['id' => $point->id]);
        }
    }
}
