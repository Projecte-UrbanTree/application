<?php

namespace Tests\Feature\Admin;

use App\Models\Contract;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

/**
 * Class ContractTest
 *
 * Tests for admin contract management functionality.
 */
class ContractTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that an admin can create a contract.
     *
     * @return void
     */
    public function test_it_can_create_a_contract()
    {
        Sanctum::actingAs(User::factory()->admin()->create());

        $contractData = [
            'name' => 'Test Contract',
            'start_date' => '2023-01-01',
            'end_date' => '2023-12-31',
            'final_price' => 10000,
            'status' => 0,
        ];

        $response = $this->postJson('/api/admin/contracts', $contractData);

        $response->assertStatus(201)
            ->assertJsonFragment(['name' => 'Test Contract']);

        $this->assertDatabaseHas('contracts', $contractData);
    }

    /**
     * Test that an admin can update a contract.
     *
     * @return void
     */
    public function test_it_can_update_a_contract()
    {
        Sanctum::actingAs(User::factory()->admin()->create());

        $contract = Contract::factory()->create();

        $updatedData = [
            'name' => 'Updated Contract',
            'final_price' => 15000,
        ];

        $response = $this->putJson("/api/admin/contracts/{$contract->id}", $updatedData);

        $response->assertOk()
            ->assertJsonFragment(['name' => 'Updated Contract']);

        $this->assertDatabaseHas('contracts', array_merge($updatedData, ['id' => $contract->id]));
    }

    /**
     * Test that an admin can delete a contract.
     *
     * @return void
     */
    public function test_it_can_delete_a_contract()
    {
        Sanctum::actingAs(User::factory()->admin()->create());

        $contract = Contract::factory()->create();

        $response = $this->deleteJson("/api/admin/contracts/{$contract->id}");

        $response->assertStatus(200)
            ->assertJson(['message' => 'Contract deleted']);

        $this->assertDatabaseMissing('contracts', ['id' => $contract->id]);
    }
}
