<?php

namespace Tests\Feature;

use App\Models\Exercise;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ExerciseFeatureTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_create_exercise()
    {
        Storage::fake('local');
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/exercises', [
            'title' => 'New Exercise',
            'description' => 'Test description',
            'images' => [UploadedFile::fake()->image('pic.jpg')],
            'codeFiles' => [UploadedFile::fake()->create('code.php')],
            'testFile' => UploadedFile::fake()->create('test.php'),
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('exercises', ['title' => 'New Exercise']);
    }

    public function test_authenticated_user_can_update_exercise()
    {
        Storage::fake('local');
        $user = User::factory()->create();
        $this->actingAs($user);

        $exercise = Exercise::factory()->create([
            'title' => 'Title',
            'description' => 'Description']);

        $response = $this->putJson("/api/exercises/{$exercise->id}", [
            'title' => 'Updated Title',
            'description' => 'Updated description',
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('exercises', ['title' => 'Updated Title']);
    }

    public function test_authenticated_user_can_delete_exercise()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $exercise = Exercise::factory()->create([
            'title' => 'Title',
            'description' => 'Description']);

        $response = $this->deleteJson("/api/exercises/{$exercise->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('exercises', ['id' => $exercise->id]);
    }

    public function test_guest_cannot_access_exercise_routes()
    {
        $exercise = Exercise::factory()->create();

        $this->getJson("/api/exercises/{$exercise->id}")->assertStatus(401);
        $this->postJson('/api/exercises', [])->assertStatus(401);
        $this->putJson("/api/exercises/{$exercise->id}", [])->assertStatus(401);
        $this->deleteJson("/api/exercises/{$exercise->id}")->assertStatus(401);
    }
    public function test_student_cannot_access_exercise_routes()
    {
        $user = User::factory()->create();
        $user->employee_type = 'student';
        $this->actingAs($user);

        $exercise = Exercise::factory()->create();

        $this->getJson("/api/exercises/{$exercise->id}")->assertStatus(403);
        $this->postJson('/api/exercises', [])->assertStatus(403);
        $this->putJson("/api/exercises/{$exercise->id}", [])->assertStatus(403);
        $this->deleteJson("/api/exercises/{$exercise->id}")->assertStatus(403);
    }

    public function test_validation_errors_on_create()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->postJson('/api/exercises', [
            // Missing required fields intentionally
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['title', 'description']);

    }

    public function test_get_exercise_by_id_returns_expected_structure()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        Storage::fake('local');

        $postResponse = $this->postJson('/api/exercises', [
            'title' => 'Retrieve Test',
            'description' => 'Details here',
            'images' => [UploadedFile::fake()->image('img.png')],
            'codeFiles' => [UploadedFile::fake()->create('index.php')],
            'testFile' => UploadedFile::fake()->create('testFile.php'),
        ]);

        $postResponse->assertStatus(201);

        $exerciseId = $postResponse->json('exercise.id');

        $getResponse = $this->getJson("/api/exercises/{$exerciseId}");
        $getResponse->assertStatus(200);
        $getResponse->assertJsonStructure([
            'exercise' => ['id', 'title', 'description', 'created_at', 'updated_at'],
            'images' => [['file_name', 'file_data']],
            'files' => [['file_name', 'file_data']]
        ]);
    }

}
