<?php

namespace App\Http\Controllers;

use App\Http\Requests\CourseRequest;
use App\Models\Course;
use App\Models\CourseEnrollment;
use App\Models\Exercise;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CourseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): \Illuminate\Http\JsonResponse
    {
        $courses = Course::all();

        return response()->json(['courses' => $courses], 200);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CourseRequest $request): \Illuminate\Http\JsonResponse
    {
        Log::info('test log1 ' . Auth::id());
        DB::beginTransaction();
        try {

            Log::info('test log2');
            $fields = $request->validated();
            Log::info('Validated Fields:', $fields);
            $course = Course::query()->create([
                'name' => $fields['name'],
                'semester' => $fields['semester'],
                'year' => $fields['year']
            ]);
            Log::info('test log3');

            if ($request->has('csvFiles')) {
                foreach ($request->file('csvFiles', []) as $csvFile) {
                    if (($handle = fopen($csvFile->getRealPath(), 'r')) !== false) {
                        $header = fgetcsv($handle); // Get header row

                        while (($row = fgetcsv($handle)) !== false) {
                            $uid = end($row);
                            if (!$uid) {
                                continue;
                            }

                            Log::info('test log4');
                            Log::info('course_id '.$course->id);
                            Log::info('uid '.$uid);
                            $user = User::query()->where('uid', $uid)->first();
                            if ($user) {
                                $course->users()->attach($user->id);
                            } else {
                                CourseEnrollment::query()->create([
                                    'course_id' => $course->id,
                                    'uid' => $uid,
                                ]);
                            }

                            Log::info('test log5');
                        }

                        fclose($handle);
                    }
                }

            }
            DB::commit();

            Log::info('test log6');
            return response()->json(['course' => $course], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to create exercise'. $e], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): \Illuminate\Http\JsonResponse
    {
        $course = Course::query()->findOrFail($id);

        $uidToEnroll = CourseEnrollment::query()->where('course_id', $id)->pluck('uid')->toArray();
        $uidEnrolled = $course->users()->pluck('uid')->toArray();
        $allUids = array_unique(array_merge($uidToEnroll, $uidEnrolled));

        Log::info('$uidToEnroll: ' . implode(', ', $uidToEnroll));
        Log::info('$uidEnrolled: ' . implode(', ', $uidEnrolled));
        Log::info('$allUids: ' . implode(', ', $allUids));

        // Build list with enrollment status
        $uidList = array_map(function($uid) use ($uidEnrolled) {
            return [
                'uid' => $uid,
                'enrolled' => in_array($uid, $uidEnrolled)
            ];
        }, $allUids);

        return response()->json([
            'course' => $course,
            'uids' => $uidList
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function addExercise(string $courseId, string $exerciseId): \Illuminate\Http\JsonResponse
    {
        $course = Course::query()->findOrFail($courseId);
        $exercise = Exercise::query()->findOrFail($exerciseId);

        // Attach without detaching existing ones
        $course->exercises()->syncWithoutDetaching($exercise->id);

        return response()->json(['message' => 'Exercise added to course successfully!'], 200);
    }
}
