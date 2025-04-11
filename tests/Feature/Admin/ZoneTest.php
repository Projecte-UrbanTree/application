<?php

namespace Tests\Feature\Admin;

use App\Models\Contract;
use App\Models\User;
use App\Models\Zone;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

/**
 * Class ZoneTest
 *
 * Tests for admin zone management functionality.
 */
class ZoneTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that an admin can create a zone.
     *
     * @return void
     */
    public function test_it_can_create_a_zone()
    {
        Sanctum::actingAs(User::factory()->admin()->create());

        $contract = Contract::factory()->create();

        $zoneData = [
            'name' => 'Test Zone',
            'description' => 'This is a test zone.',
            'color' => '#FF0000',
            'contract_id' => $contract->id,
        ];

        $response = $this->postJson('/api/admin/zones', $zoneData);

        $response->assertStatus(201)
            ->assertJsonFragment(['name' => 'Test Zone']);

        $this->assertDatabaseHas('zones', $zoneData);
    }

    /**
     * Test that an admin can update a zone.
     *
     * @return void
     */
    public function test_it_can_update_a_zone()
    {
        Sanctum::actingAs(User::factory()->admin()->create());

        // Crear un contrato y una zona asociados
        $contract = Contract::factory()->create();
        $zone = Zone::factory()->create(['contract_id' => $contract->id]);

        $updatedData = [
            'name' => 'Updated Zone',
            'description' => 'Updated description.',
            'color' => '#00FF00',
        ];

        $response = $this->putJson("/api/admin/zones/{$zone->id}", $updatedData);

        $response->assertOk()
            ->assertJsonFragment(['name' => 'Updated Zone']);

        $this->assertDatabaseHas('zones', array_merge($updatedData, ['id' => $zone->id]));
    }

    /**
     * Test that an admin can delete a zone.
     *
     * @return void
     */
    public function test_it_can_delete_a_zone()
    {
        Sanctum::actingAs(User::factory()->admin()->create());

        // Crear un contrato y una zona asociados
        $contract = Contract::factory()->create();
        $zone = Zone::factory()->create(['contract_id' => $contract->id]);

        $response = $this->deleteJson("/api/admin/zones/{$zone->id}");

        $response->assertStatus(200)
            ->assertJson(['message' => 'Zona eliminada']);

        $this->assertDatabaseMissing('zones', ['id' => $zone->id]);
    }
}
