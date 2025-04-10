<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

/**
 * Class UserTest
 *
 * Tests for admin user management functionality.
 */
class UserTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that an admin can create a user.
     *
     * @return void
     */
    public function test_it_can_create_a_user()
    {
        Sanctum::actingAs(User::factory()->admin()->create());

        $userData = [
            'name' => 'Test User',
            'surname' => 'Test Surname',
            'email' => 'testuser@example.com',
            'company' => 'Test Company',
            'dni' => '12345678-A',
            'role' => 'worker',
            'password' => 'password123',
        ];

        $response = $this->postJson('/api/admin/users', $userData);

        $response->assertStatus(201)
            ->assertJsonFragment(['name' => 'Test User']);

        $this->assertDatabaseHas('users', [
            'name' => 'Test User',
            'surname' => 'Test Surname',
            'email' => 'testuser@example.com',
            'company' => 'Test Company',
            'dni' => '12345678-A',
            'role' => 'worker',
        ]);
    }

    /**
     * Test that an admin can update a user.
     *
     * @return void
     */
    public function test_it_can_update_a_user()
    {
        Sanctum::actingAs(User::factory()->admin()->create());

        $user = User::factory()->create();

        $updatedData = [
            'name' => 'Updated User',
            'surname' => 'Updated Surname',
            'company' => 'Updated Company',
        ];

        $response = $this->putJson("/api/admin/users/{$user->id}", $updatedData);

        $response->assertOk()
            ->assertJsonFragment(['name' => 'Updated User']);

        $this->assertDatabaseHas('users', array_merge($updatedData, ['id' => $user->id]));
    }

    /**
     * Test that an admin can delete a user.
     *
     * @return void
     */
    public function test_it_can_delete_a_user()
    {
        Sanctum::actingAs(User::factory()->admin()->create());

        $user = User::factory()->create();

        $response = $this->deleteJson("/api/admin/users/{$user->id}");

        $response->assertStatus(200)
            ->assertJson(['message' => 'Usuario eliminado']);

        $this->assertDatabaseMissing('users', ['id' => $user->id]);
    }
}
