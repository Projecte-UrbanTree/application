<?php

namespace Tests\Feature\Admin;

use App\Models\ElementType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

/**
 * Class ElementTypeTest
 *
 * Tests for admin element type management functionality.
 */
class ElementTypeTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Ensure the database is migrated before running tests.
     *
     * @return void
     */
    protected function setUp(): void
    {
        parent::setUp();
        $this->artisan('migrate'); // Asegúrate de que las migraciones se ejecuten.
    }

    /**
     * Test that an admin can create an element type.
     *
     * @return void
     */
    public function test_it_can_create_an_element_type()
    {
        Sanctum::actingAs(User::factory()->admin()->create());

        $elementTypeData = [
            'name' => 'Test ElementType',
            'requires_tree_type' => true,
            'description' => 'Test description',
            'icon' => 'tree',
            'color' => '#FFFFFF',
        ];

        $response = $this->postJson('/api/admin/element-types', $elementTypeData);

        $response->assertStatus(201)
            ->assertJsonFragment(['name' => 'Test ElementType']);

        $this->assertDatabaseHas('element_types', $elementTypeData);
    }

    /**
     * Test that an admin can update an element type.
     *
     * @return void
     */
    public function test_it_can_update_an_element_type()
    {
        Sanctum::actingAs(User::factory()->admin()->create());

        $elementType = ElementType::factory()->create();

        $updatedData = [
            'name' => 'Updated ElementType',
            'requires_tree_type' => $elementType->requires_tree_type,
            'icon' => $elementType->icon,
            'color' => '#000000',
        ];

        $response = $this->putJson("/api/admin/element-types/{$elementType->id}", $updatedData);

        $response->assertOk()
            ->assertJsonFragment(['name' => 'Updated ElementType']);

        $this->assertDatabaseHas('element_types', array_merge($updatedData, ['id' => $elementType->id]));
    }

    /**
     * Test that an admin can delete an element type.
     *
     * @return void
     */
    public function test_it_can_delete_an_element_type()
    {
        Sanctum::actingAs(User::factory()->admin()->create());

        $elementType = ElementType::factory()->create();

        $response = $this->deleteJson("/api/admin/element-types/{$elementType->id}");

        $response->assertStatus(200)
            ->assertJson(['message' => 'Elemento eliminado']);

        $this->assertDatabaseMissing('element_types', ['id' => $elementType->id]);
    }
}
