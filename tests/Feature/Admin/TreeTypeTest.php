<?php

namespace Tests\Feature\Admin;

use App\Models\TreeType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

/**
 * Class TreeTypeTest
 *
 * Tests for admin tree type management functionality.
 */
class TreeTypeTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that an admin can create a tree type.
     *
     * @return void
     */
    public function test_it_can_create_a_tree_type()
    {
        Sanctum::actingAs(User::factory()->admin()->create());

        $treeTypeData = [
            'family' => 'Fagaceae',
            'genus' => 'Quercus',
            'species' => 'Robur',
        ];

        $response = $this->postJson('/api/admin/tree-types', $treeTypeData);

        $response->assertStatus(201)
            ->assertJsonFragment(['family' => 'Fagaceae']);

        $this->assertDatabaseHas('tree_types', $treeTypeData);
    }

    /**
     * Test that an admin can update a tree type.
     *
     * @return void
     */
    public function test_it_can_update_a_tree_type()
    {
        Sanctum::actingAs(User::factory()->admin()->create());

        $treeType = TreeType::factory()->create();

        $updatedData = [
            'family' => 'Rosaceae',
            'genus' => 'Malus',
            'species' => 'Domestica',
        ];

        $response = $this->putJson("/api/admin/tree-types/{$treeType->id}", $updatedData);

        $response->assertOk()
            ->assertJsonFragment(['family' => 'Rosaceae']);

        $this->assertDatabaseHas('tree_types', array_merge($updatedData, ['id' => $treeType->id]));
    }

    /**
     * Test that an admin can delete a tree type.
     *
     * @return void
     */
    public function test_it_can_delete_a_tree_type()
    {
        Sanctum::actingAs(User::factory()->admin()->create());

        $treeType = TreeType::factory()->create();

        $response = $this->deleteJson("/api/admin/tree-types/{$treeType->id}");

        $response->assertStatus(204);

        $this->assertDatabaseMissing('tree_types', ['id' => $treeType->id]);
    }
}
