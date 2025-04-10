<?php

namespace Tests\Feature\Admin;

use App\Models\Eva;
use App\Models\Element;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class EvaTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_can_create_an_eva()
    {
        Sanctum::actingAs(User::factory()->admin()->create());

        $element = Element::factory()->create();

        $evaData = [
            'element_id' => $element->id,
            'date_birth' => '2023-01-01',
            'height' => 10.5,
            'diameter' => 2.3,
            'crown_width' => 5.0,
            'crown_projection_area' => 20.0,
            'root_surface_diameter' => 3.0,
            'effective_root_area' => 15.0,
            'height_estimation' => 12.0,
            'unbalanced_crown' => 0,
            'overextended_branches' => 0,
            'cracks' => 0,
            'dead_branches' => 0,
            'inclination' => 0,
            'V_forks' => 0,
            'cavities' => 0,
            'bark_damage' => 0,
            'soil_lifting' => 0,
            'cut_damaged_roots' => 0,
            'basal_rot' => 0,
            'exposed_surface_roots' => 0,
            'wind' => 0,
            'drought' => 0,
            'status' => 1,
        ];

        $response = $this->postJson('/api/admin/evas', $evaData);

        $response->assertStatus(201)
            ->assertJsonFragment(['element_id' => $element->id]);

        $this->assertDatabaseHas('eva', $evaData);
    }

    public function test_it_can_update_an_eva()
    {
        Sanctum::actingAs(User::factory()->admin()->create());

        $element = Element::factory()->create();
        $eva = Eva::factory()->create(['element_id' => $element->id]);

        $updatedData = [
            'element_id' => $element->id,
            'height' => 15.0,
            'diameter' => 3.0,
            'crown_width' => 6.0,
            'crown_projection_area' => 25.0,
            'root_surface_diameter' => 4.0,
            'effective_root_area' => 18.0,
            'height_estimation' => 14.0,
            'unbalanced_crown' => 1,
            'overextended_branches' => 1,
            'cracks' => 1,
            'dead_branches' => 1,
            'inclination' => 1,
            'V_forks' => 1,
            'cavities' => 1,
            'bark_damage' => 1,
            'soil_lifting' => 1,
            'cut_damaged_roots' => 1,
            'basal_rot' => 1,
            'exposed_surface_roots' => 1,
            'wind' => 1,
            'drought' => 1,
            'status' => 2,
        ];

        $response = $this->putJson("/api/admin/evas/{$eva->id}", $updatedData);

        $response->assertOk()
            ->assertJsonFragment(['height' => 15.0]);

        $this->assertDatabaseHas('eva', array_merge($updatedData, ['id' => $eva->id]));
    }

    public function test_it_can_delete_an_eva()
    {
        Sanctum::actingAs(User::factory()->admin()->create());

        $eva = Eva::factory()->create();

        $response = $this->deleteJson("/api/admin/evas/{$eva->id}");

        $response->assertStatus(200)
            ->assertJson(['message' => 'Eva deleted successfully']);

        $this->assertDatabaseMissing('eva', ['id' => $eva->id]);
    }
}
