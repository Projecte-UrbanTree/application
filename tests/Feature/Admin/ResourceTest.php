<?php

namespace Tests\Feature\Admin;

use App\Models\Contract;
use App\Models\Resource;
use App\Models\ResourceType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

/**
 * Class ResourceTest
 *
 * Tests for admin resource management functionality.
 */
class ResourceTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that an admin can create a resource.
     *
     * @return void
     */
    public function test_it_can_create_a_resource()
    {
        Sanctum::actingAs(User::factory()->admin()->create());

        // Crear un contrato
        $contract = Contract::factory()->create();
        $this->assertDatabaseHas('contracts', ['id' => $contract->id]);

        // Crear un tipo de recurso
        $resourceType = ResourceType::factory()->create();

        $resourceData = [
            'contract_id' => $contract->id,
            'name' => 'Test Resource',
            'description' => 'This is a test resource.',
            'resource_type_id' => $resourceType->id,
            'unit_name' => 'Unit',
            'unit_cost' => 50.75,
        ];

        $response = $this->postJson('/api/admin/resources', $resourceData);

        $response->assertStatus(201)
            ->assertJsonFragment(['name' => 'Test Resource']);

        $this->assertDatabaseHas('resources', $resourceData);
    }

    /**
     * Test that an admin can update a resource.
     *
     * @return void
     */
    public function test_it_can_update_a_resource()
    {
        Sanctum::actingAs(User::factory()->admin()->create());

        $resource = Resource::factory()->create();

        $updatedData = [
            'name' => 'Updated Resource',
            'description' => 'Updated description.',
            'unit_name' => 'Updated Unit',
            'unit_cost' => 75.50,
        ];

        $response = $this->putJson("/api/admin/resources/{$resource->id}", $updatedData);

        $response->assertOk()
            ->assertJsonFragment(['name' => 'Updated Resource']);

        $this->assertDatabaseHas('resources', array_merge($updatedData, ['id' => $resource->id]));
    }

    /**
     * Test that an admin can delete a resource.
     *
     * @return void
     */
    public function test_it_can_delete_a_resource()
    {
        Sanctum::actingAs(User::factory()->admin()->create());

        $resource = Resource::factory()->create();

        $response = $this->deleteJson("/api/admin/resources/{$resource->id}");

        $response->assertStatus(200)
            ->assertJson(['message' => 'Recurso eliminado']);

        $this->assertDatabaseMissing('resources', ['id' => $resource->id]);
    }
}
