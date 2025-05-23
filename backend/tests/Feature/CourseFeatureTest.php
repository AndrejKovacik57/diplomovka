<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\CourseEnrollment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class CourseFeatureTest extends TestCase
{
    use RefreshDatabase;

    protected function signInTeacher(): CourseFeatureTest
    {
        return $this->actingAs(User::factory()->create([
            'employee_type' => 'teacher',
        ]));
    }

    public function test_teacher_can_create_course_with_csv()
    {
        Storage::fake('local');
        $this->signInTeacher();

        $csv = UploadedFile::fake()->createWithContent('students.csv', <<<CSV
                first_name,last_name,uid
                John,Doe,student123
                Jane,Doe,student456
                CSV
        );

        $response = $this->postJson('/api/courses', [
            'name' => 'Software Design',
            'semester' => 'winter',
            'year' => '2025',
            'csvFiles' => [$csv],
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('courses', ['name' => 'Software Design']);
        $this->assertDatabaseHas('course_enrollments', ['uid' => 'student123']);
        $this->assertDatabaseHas('course_enrollments', ['uid' => 'student456']);
    }

    public function test_guest_cannot_create_course()
    {
        $response = $this->postJson('/api/courses', []);
        $response->assertStatus(401); // Unauthenticated
    }

    public function test_student_cannot_create_course()
    {
        $this->actingAs(User::factory()->create(['employee_type' => 'student']));

        $response = $this->postJson('/api/courses', []);
        $response->assertStatus(403); // Forbidden
    }

    public function test_validation_errors_when_missing_fields()
    {
        $this->signInTeacher();

        $response = $this->postJson('/api/courses', [
            // Missing name, semester, year
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['name', 'semester', 'year']);
    }

    public function test_teacher_can_get_course_details()
    {
        $this->signInTeacher();

        $course = Course::factory()->create([
            'name' => 'Test Course',
            'semester' => 'summer',
            'year' => 2025,
        ]);

        // Add a dummy UID directly to course_enrollments
        CourseEnrollment::create([
            'course_id' => $course->id,
            'uid' => 'dummy_uid',
        ]);

        $response = $this->getJson("/api/courses/{$course->id}");
        $response->assertStatus(200);

        $response->assertJsonStructure([
            'course',
            'uids' => [['uid', 'enrolled', 'user_id', 'first_name', 'last_name']],
            'exercises' // optional if not using exercises in test
        ]);
    }
}
