<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class StudentController extends Controller
{
    public function getUsersCourseExercises(): JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();

        $courses = $user->courses()->with('exercises')->get();
        $result = [];

        foreach ($courses as $course) {
            $courseData = $course->toArray();
            $courseData['exercises'] = [];

            foreach ($course->exercises as $exercise) {
                $exerciseData = $exercise->toArray();
                $exerciseData['pivot'] = [
                    'start' => $exercise->pivot->start,
                    'end' => $exercise->pivot->end,
                ];

                $courseData['exercises'][] = $exerciseData;
            }

            $result[] = $courseData;
        }
        return response()->json(['courses' => $result]);

    }
}
