<?php

namespace Tests\Unit;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\ResourceType;
use App\Models\ElementType;

class AdminTest extends TestCase
{
    use RefreshDatabase;

    protected $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create([
            'name' => 'Gemma Palanca',
            'surname' => 'UserSurname'
        ]);
    }

    public function test_user_can_access_application()
    {
        $response = $this->actingAs($this->user)->get('/home');
        $response->assertStatus(200);
    }

    public function test_user_can_create_resource_type()
    {
        $this->actingAs($this->user);

        $resourceType = ResourceType::create([
            'name' => 'ResourceType1',
            'description' => null,
        ]);

        $this->assertDatabaseHas('resource_types', [
            'id' => $resourceType->id,
            'name' => 'ResourceType1',
            'description' => null,
        ]);
    }

    public function test_user_can_create_element_type()
    {
        $this->actingAs($this->user);

        $elementType = ElementType::create([
            'name' => 'ElementType1',
            'description' => null,
        ]);

        $this->assertDatabaseHas('element_types', [
            'id' => $elementType->id,
            'name' => 'ElementType1',
            'description' => null,
        ]);
    }

    public function test_user_can_delete_element_type()
    {
        $this->actingAs($this->user);

        $elementType = ElementType::create([
            'name' => 'ElementTypeToDelete',
            'description' => null,
        ]);

        $elementType->delete();

        $this->assertDatabaseMissing('element_types', [
            'id' => $elementType->id,
        ]);
    }

    public function test_user_cannot_create_element_type_with_symbols()
    {
        $this->actingAs($this->user);

        $response = $this->post('/element-types', [
            'name' => 'Element@Type#1!',
            'description' => null,
        ]);

        $response->assertSessionHasErrors('name');
    }
}
