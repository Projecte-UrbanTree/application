<?php

namespace Tests\Feature\Admin;

use App\Models\ResourceType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

/**
 * Class ResourceTypeTest
 *
 * Tests for admin resource type management functionality.
 */
class ResourceTypeTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that an admin can create a resource type.
     *
     * @return void
     */
    public function test_it_can_create_a_resource_type()
    {
        Sanctum::actingAs(User::factory()->admin()->create());

        $resourceTypeData = [
            'name' => 'Test ResourceType',
            'description' => 'This is a test resource type.',
        ];

        $response = $this->postJson('/api/admin/resource-types', $resourceTypeData);

        $response->assertStatus(201)
            ->assertJsonFragment(['name' => 'Test ResourceType']);

        $this->assertDatabaseHas('resource_types', $resourceTypeData);
    }

    /**
     * Test that an admin can update a resource type.
     *
     * @return void
     */
    public function test_it_can_update_a_resource_type()
    {
        Sanctum::actingAs(User::factory()->admin()->create());

        $resourceType = ResourceType::factory()->create([
            'name' => 'Original ResourceType',
            'description' => 'Original description.',
        ]);

        $updatedData = [
            'name' => 'Updated ResourceType',
            'description' => 'Updated description.',
        ];

        $response = $this->putJson("/api/admin/resource-types/{$resourceType->id}", $updatedData);

        $response->assertOk()
            ->assertJsonFragment(['name' => 'Updated ResourceType']);

        $this->assertDatabaseHas('resource_types', array_merge($updatedData, ['id' => $resourceType->id]));
    }

    /**
     * Test that an admin can delete a resource type.
     *
     * @return void
     */
    public function test_it_can_delete_a_resource_type()
    {
        Sanctum::actingAs(User::factory()->admin()->create());

        $resourceType = ResourceType::factory()->create();

        $response = $this->deleteJson("/api/admin/resource-types/{$resourceType->id}");

        $response->assertStatus(200)
            ->assertJson(['message' => 'Tipo de recurso eliminado']);

        $this->assertDatabaseMissing('resource_types', ['id' => $resourceType->id]);
    }
}
