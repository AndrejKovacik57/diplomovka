<?php

namespace Tests\Feature;

use App\Jobs\RunSolutionTests;
use App\Models\CourseExercise;
use App\Models\Exercise;
use App\Models\Files;
use App\Models\Solution;
use App\Models\SolutionTestResult;
use App\Models\Tests as ExerciseTest;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class SolutionJobTest extends TestCase
{
    use RefreshDatabase;

    public function test_run_solution_tests_job_creates_test_results()
    {
        Storage::fake('local');

        // Create user + exercise setup
        $user = User::factory()->create();
        $exercise = Exercise::factory()->create();

        // Simulate related test file
        $testFile = ExerciseTest::factory()->create([
            'exercise_id' => $exercise->id,
            'file_name' => 'test.php',
            'file_path' => 'tests/test.php',
        ]);

        // Simulate associated course exercise
        $courseExercise = CourseExercise::factory()->create([
            'exercise_id' => $exercise->id,
            'public' => false,
        ]);

        // Create solution
        $solution = Solution::factory()->create([
            'user_id' => $user->id,
            'course_exercise_id' => $courseExercise->id,
            'file_name' => 'solution.php',
            'file_path' => 'solutions/solution.php',
            'test_status' => Solution::STATUS_PENDING,
        ]);

        $solutionPath = storage_path('app/private/solutions');
        $testPath = storage_path('app/private/tests');

        if (!file_exists($solutionPath)) {
            mkdir($solutionPath, 0777, true);
        }
        if (!file_exists($testPath)) {
            mkdir($testPath, 0777, true);
        }

        file_put_contents("{$solutionPath}/solution.php", "<?php echo \"[PASS] testOne\\n[FAIL] testTwo\\n\";");
        file_put_contents("{$testPath}/test.php", "<?php include '/test/solution.php';");



        // Create Files model if needed for additional exercise files
        Files::factory()->create([
            'exercise_id' => $exercise->id,
            'file_name' => 'extra.json',
            'file_path' => 'extras/extra.json',
        ]);
        $path = storage_path('app/private/extras');
        if (!file_exists($path)) {
            mkdir($path, 0777, true);
        }
        file_put_contents("{$path}/extra.json", '{}');





        // Act - Run the job
        (new RunSolutionTests($solution))->handle();

        // Assert
        $this->assertDatabaseHas('solutions', [
            'id' => $solution->id,
            'test_status' => Solution::STATUS_FINISHED,
            'test_output' => '1/2',
        ]);

        $this->assertDatabaseHas('solution_test_results', [
            'solution_id' => $solution->id,
            'test_name' => 'testOne',
            'status' => 'passed',
        ]);

        $this->assertDatabaseHas('solution_test_results', [
            'solution_id' => $solution->id,
            'test_name' => 'testTwo',
            'status' => 'failed',
        ]);
    }
}
