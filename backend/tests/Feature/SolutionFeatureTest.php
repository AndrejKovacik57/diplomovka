<?php

namespace Tests\Feature;

use App\Jobs\RunSolutionTests;
use App\Models\Course;
use App\Models\CourseExercise;
use App\Models\Exercise;
use App\Models\Solution;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class SolutionFeatureTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_store_solution_for_private_exercise()
    {
        Queue::fake();
        Storage::fake('local');

        $user = User::factory()->create();
        $user->employee_type = 'student';
        $user->save();
        $this->actingAs($user);

        $course = Course::factory()->create();
        $exercise = Exercise::factory()->create();
        $courseExercise = CourseExercise::factory()->create([
            'course_id' => $course->id,
            'exercise_id' => $exercise->id,
            'public' => false,
        ]);

        $file = UploadedFile::fake()->create('solution.php', 10);

        $response = $this->postJson('/api/solutions', [
            'courseId' => $course->id,
            'exerciseId' => $exercise->id,
            'codeFile' => $file,
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('solutions', [
            'user_id' => $user->id,
            'course_exercise_id' => $courseExercise->id,
            'file_name' => 'solution.php',
            'test_status' => Solution::STATUS_PENDING,
        ]);

        Storage::disk('local')->assertExists('solutions/' . preg_replace('/\.[^.]+$/', '', $file->hashName()) . '.php');

        Queue::assertPushed(RunSolutionTests::class);
    }

    public function test_guest_cannot_store_solution()
    {
        $response = $this->postJson('/api/solutions', []);
        $response->assertStatus(401);
    }

    public function test_user_cannot_store_solution_for_public_exercise()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $course = Course::factory()->create();
        $exercise = Exercise::factory()->create();
        CourseExercise::factory()->create([
            'course_id' => $course->id,
            'exercise_id' => $exercise->id,
            'public' => true,
        ]);

        $file = UploadedFile::fake()->create('solution.php');

        $response = $this->postJson('/api/solutions', [
            'courseId' => $course->id,
            'exerciseId' => $exercise->id,
            'codeFile' => $file,
        ]);

        $response->assertStatus(403);
    }
}
