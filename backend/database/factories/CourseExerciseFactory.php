<?php

namespace Database\Factories;

use App\Models\Course;
use App\Models\Exercise;
use Illuminate\Support\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CourseExercise>
 */
class CourseExerciseFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'course_id' => Course::factory(),
            'exercise_id' => Exercise::factory(),
            'public' => false,
            'start' => Carbon::now()->subDays(1),
            'end' => Carbon::now()->addDays(7),
        ];
    }
}
