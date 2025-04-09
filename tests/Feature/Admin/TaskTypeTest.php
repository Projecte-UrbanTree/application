<?php

namespace Tests\Feature\Admin;

use App\Models\TaskType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

/**
 * Class TaskTypeTest
 *
 * Tests for admin task type management functionality.
 */
class TaskTypeTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that an admin can create a task type.
     *
     * @return void
     */
    public function test_it_can_create_a_task_type()
    {
        Sanctum::actingAs(User::factory()->admin()->create());

        $taskTypeData = [
            'name' => 'Inspection',
            'description' => 'Task for inspecting elements',
        ];

        $response = $this->postJson('/api/admin/task-types', $taskTypeData);

        $response->assertStatus(201)
            ->assertJsonFragment(['name' => 'Inspection']);

        $this->assertDatabaseHas('task_types', $taskTypeData);
    }

    /**
     * Test that an admin can update a task type.
     *
     * @return void
     */
    public function test_it_can_update_a_task_type()
    {
        Sanctum::actingAs(User::factory()->admin()->create());

        $taskType = TaskType::factory()->create();

        $updatedData = [
            'name' => 'Maintenance',
            'description' => 'Task for maintaining elements',
        ];

        $response = $this->putJson("/api/admin/task-types/{$taskType->id}", $updatedData);

        $response->assertOk()
            ->assertJsonFragment(['name' => 'Maintenance']);

        $this->assertDatabaseHas('task_types', array_merge($updatedData, ['id' => $taskType->id]));
    }

    /**
     * Test that an admin can delete a task type.
     *
     * @return void
     */
    public function test_it_can_delete_a_task_type()
    {
        Sanctum::actingAs(User::factory()->admin()->create());

        $taskType = TaskType::factory()->create();

        $response = $this->deleteJson("/api/admin/task-types/{$taskType->id}");

        $response->assertStatus(200)
            ->assertJson(['message' => 'Tipus de tasca eliminat']);

        $this->assertDatabaseMissing('task_types', ['id' => $taskType->id]);
    }
}
