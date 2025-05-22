<?php

namespace App\Services;

use App\Models\Course;
use App\Models\CourseEnrollment;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\DB;

class CourseService
{
    /**
     * @throws Exception
     */
    public function createCourse(array $data): Course
    {
        return DB::transaction(function () use ($data) {
            $course = Course::query()->create([
                'name' => $data['name'],
                'semester' => $data['semester'],
                'year' => $data['year'],
            ]);

            foreach ($data['csvFiles'] as $csvFile) {
                $this->processCsvFile($csvFile, $course->id);
            }

            return $course;
        });
    }

    private function processCsvFile($csvFile, int $courseId): void
    {
        if (($handle = fopen($csvFile->getRealPath(), 'r')) !== false) {
            fgetcsv($handle); // skip header

            while (($row = fgetcsv($handle)) !== false) {
                $uid = end($row);
                if (!$uid) {
                    continue;
                }

                $user = User::query()->where('uid', $uid)->first();
                if ($user) {
                    $user->courses()->attach($courseId);
                } else {
                    CourseEnrollment::query()->create([
                        'course_id' => $courseId,
                        'uid' => $uid,
                    ]);
                }
            }

            fclose($handle);
        }
    }

    public function getCourseDetails(int $id): array
    {
        $course = Course::query()->findOrFail($id);
        $uidToEnroll = $course->enrollments()->pluck('uid')->toArray();
        $uidEnrolled = $course->users()->pluck('uid')->toArray();
        $allUids = array_unique(array_merge($uidToEnroll, $uidEnrolled));

        $uidList = array_map(function ($uid) use ($uidEnrolled, $course) {
            $isEnrolled = in_array($uid, $uidEnrolled);
            $user = $isEnrolled ? $course->users()->where('uid', $uid)->first() : null;

            return [
                'uid' => $uid,
                'enrolled' => $isEnrolled,
                'user_id' => $user?->id,
                'first_name' => $user?->first_name,
                'last_name' => $user?->last_name,
            ];
        }, $allUids);

        $exercises = $course->exercises()->get()->map(function ($exercise) {
            return [
                'id' => $exercise->pivot->id,
                'title' => $exercise->title,
                'description' => $exercise->description,
                'start_datetime' => $exercise->pivot->start,
                'end_datetime' => $exercise->pivot->end,
            ];
        });

        return [
            'course' => $course,
            'uids' => $uidList,
            'exercises' => $exercises,
        ];
    }
}
