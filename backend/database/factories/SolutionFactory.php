<?php

namespace Database\Factories;

use App\Models\CourseExercise;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Solution>
 */
class SolutionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'course_exercise_id' => CourseExercise::factory(),
            'user_id' => User::factory(),
            'file_path' => 'solutions/fake/path.php',
            'file_name' => 'path.php',
            'test_status' => 'pending',
            'test_output' => null,
            'is_active' => true,
        ];
    }
}
