<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

/**
 * Class AccountTest
 *
 * Tests for admin account management functionality
 */
class AccountTest extends TestCase
{
    use RefreshDatabase;
    use WithFaker;

    /**
     * Test that an authenticated admin user can retrieve their profile
     *
     * @return void
     */
    public function test_it_can_get_authenticated_user_profile()
    {
        // Create an admin user and authenticate
        $user = User::factory()->admin()->create();
        Sanctum::actingAs($user);

        // Make request to show profile
        $response = $this->getJson('/api/admin/account');

        // Assert successful response
        $response->assertOk()
            ->assertJsonFragment([
                'name' => $user->name,
                'surname' => $user->surname,
                'email' => $user->email,
                'company' => $user->company,
                'dni' => $user->dni,
                'role' => $user->role,
            ]);
    }

    /**
     * Test that an authenticated admin user can update their profile information
     *
     * @return void
     */
    public function test_it_can_update_user_profile()
    {
        // Create an admin user and authenticate
        $user = User::factory()->admin()->create();
        Sanctum::actingAs($user);

        // Prepare updated profile data
        $updatedData = [
            'name' => 'John',
            'surname' => 'Doe',
            'email' => 'john.doe@example.com',
            'company' => 'Acme Inc',
            'dni' => '12345678-A',
        ];

        // Make request to update profile
        $response = $this->putJson('/api/admin/account', $updatedData);

        // Assert successful response
        $response->assertOk()
            ->assertJson(['message' => 'Perfil actualizado correctamente']);

        // Assert database was updated
        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'John',
            'surname' => 'Doe',
            'email' => 'john.doe@example.com',
            'company' => 'Acme Inc',
            'dni' => '12345678-A',
        ]);
    }

    /**
     * Test that an authenticated admin user can update their password
     * when providing the correct current password
     *
     * @return void
     */
    public function test_it_can_update_password()
    {
        // Create an admin user and authenticate
        $user = User::factory()->admin()->create([
            'password' => bcrypt('current-password'),
        ]);
        Sanctum::actingAs($user);

        // Prepare password update data
        $passwordData = [
            'currentPassword' => 'current-password',
            'newPassword' => 'new-password',
            'newPassword_confirmation' => 'new-password',
        ];

        // Make request to update password
        $response = $this->putJson('/api/admin/account/password', $passwordData);

        // Assert successful response
        $response->assertOk()
            ->assertJson(['message' => 'Contraseña actualizada correctamente']);
    }

    /**
     * Test that password update fails when the current password is incorrect
     *
     * @return void
     */
    public function test_it_validates_current_password_when_updating_password()
    {
        // Create an admin user and authenticate
        $user = User::factory()->admin()->create([
            'password' => bcrypt('current-password'),
        ]);
        Sanctum::actingAs($user);

        // Prepare password update data with wrong current password
        $passwordData = [
            'currentPassword' => 'wrong-password',
            'newPassword' => 'new-password',
            'newPassword_confirmation' => 'new-password',
        ];

        // Make request to update password
        $response = $this->putJson('/api/admin/account/password', $passwordData);

        // Assert error response
        $response->assertStatus(400)
            ->assertJson(['error' => 'La contraseña actual no es correcta']);
    }

    /**
     * Test that password update fails when the new password and confirmation don't match
     *
     * @return void
     */
    public function test_it_validates_password_confirmation_when_updating_password()
    {
        // Create an admin user and authenticate
        $user = User::factory()->admin()->create([
            'password' => bcrypt('current-password'),
        ]);
        Sanctum::actingAs($user);

        // Prepare password update data with mismatched confirmation
        $passwordData = [
            'currentPassword' => 'current-password',
            'newPassword' => 'new-password',
            'newPassword_confirmation' => 'different-password',
        ];

        // Make request to update password
        $response = $this->putJson('/api/admin/account/password', $passwordData);

        // Assert validation fails
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['newPassword']);
    }
}
