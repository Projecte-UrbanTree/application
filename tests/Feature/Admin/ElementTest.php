<?php

namespace Tests\Feature\Admin;

use App\Models\Element;
use App\Models\User;
use App\Models\ElementType;
use App\Models\Point;
use App\Models\TreeType;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ElementTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_can_create_an_element()
    {
        Sanctum::actingAs(User::factory()->admin()->create());

        // Crear registros relacionados
        $elementType = ElementType::factory()->create();
        $treeType = TreeType::factory()->create();
        $point = Point::factory()->create();

        $elementData = [
            'description' => 'Test Element',
            'element_type_id' => $elementType->id,
            'tree_type_id' => null,
            'point_id' => $point->id,
        ];

        $response = $this->postJson('/api/admin/elements', $elementData);

        $response->assertStatus(201)
            ->assertJsonFragment(['description' => 'Test Element']);

        $this->assertDatabaseHas('elements', $elementData);
    }

    public function test_it_can_update_an_element()
    {
        Sanctum::actingAs(User::factory()->admin()->create());

        // Crear registros relacionados
        $elementType = ElementType::factory()->create();
        $treeType = TreeType::factory()->create();
        $point = Point::factory()->create();

        $element = Element::factory()->create();

        $updatedData = [
            'description' => 'Updated Element',
            'element_type_id' => $elementType->id,
            'tree_type_id' => null,
            'point_id' => $point->id,
        ];

        $response = $this->putJson("/api/admin/elements/{$element->id}", $updatedData);

        $response->assertOk()
            ->assertJsonFragment(['description' => 'Updated Element']);

        $this->assertDatabaseHas('elements', array_merge($updatedData, ['id' => $element->id]));
    }

    public function test_it_can_delete_an_element()
    {
        Sanctum::actingAs(User::factory()->admin()->create());

        // Crear registros relacionados
        $elementType = ElementType::factory()->create();
        $treeType = TreeType::factory()->create();
        $point = Point::factory()->create();

        $element = Element::factory()->create([
            'element_type_id' => $elementType->id,
            'tree_type_id' => null,
            'point_id' => $point->id,
        ]);

        $response = $this->deleteJson("/api/admin/elements/{$element->id}");

        $response->assertStatus(200)
            ->assertJson(['message' => 'Element deleted successfully']);

        $this->assertDatabaseMissing('elements', ['id' => $element->id]);
    }
}
