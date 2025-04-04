<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

/**
 * Class AuthTest
 *
 * Tests for authentication related functionality
 */
class AuthTest extends TestCase
{
    use RefreshDatabase;
    use WithFaker;

    /**
     * Test that a user can login with valid credentials
     *
     * @return void
     */
    public function test_user_can_login_with_valid_credentials()
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password123'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'test@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'accessToken',
                'userData',
            ])
            ->assertJson([
                'success' => true,
            ]);
    }

    /**
     * Test that login fails with invalid credentials
     *
     * @return void
     */
    public function test_login_fails_with_invalid_credentials()
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password123'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'test@example.com',
            'password' => 'wrong-password',
        ]);

        $response->assertStatus(401)
            ->assertJson([
                'message' => __('auth.failed'),
            ]);
    }

    /**
     * Test that login request requires email and password
     *
     * @return void
     */
    public function test_login_requires_email_and_password()
    {
        $response = $this->postJson('/api/login', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email', 'password']);
    }

    /**
     * Test that a user can logout successfully
     *
     * @return void
     */
    public function test_user_can_logout()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/logout');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);

        // Check that token is revoked
        $this->assertCount(0, $user->tokens);
    }

    /**
     * Test that authenticated user can get their profile
     *
     * @return void
     */
    public function test_authenticated_user_can_get_profile()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/user');

        $response->assertStatus(200)
            ->assertJson([
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ]);
    }

    /**
     * Test that unauthenticated user cannot access protected routes
     *
     * @return void
     */
    public function test_unauthenticated_user_cannot_access_protected_routes()
    {
        $response = $this->getJson('/api/user');

        $response->assertJson([
            'error' => 'Unauthorized',
        ]);
    }
}
