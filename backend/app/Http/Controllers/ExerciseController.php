<?php

namespace App\Http\Controllers;

use App\Http\Requests\ExerciseRequest;
use App\Models\Exercise;
use App\Models\User;
use App\Services\ExerciseAccessService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;


class ExerciseController extends Controller
{

    public function index(): JsonResponse
    {
        $exercises = Exercise::all();

        return response()->json(['exercises' => $exercises], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ExerciseRequest $request): JsonResponse
    {
        Log::info('test log1 ' . Auth::id());
        DB::beginTransaction();
        try {
            $fields = $request->validated();
            Log::info('test log2');
            $exercise = Exercise::query()->create([
                'title' => $fields['title'],
                'description' => $fields['description'],
                'user_id' => Auth::id(), // Associate the exercise with the logged-in user
            ]);
            Log::info('test log3');
            if ($request->has('images')) {
                foreach ($fields['images'] as $pictureFile) {
                    $name = $pictureFile->getClientOriginalName();
                    $filePath = $pictureFile->store('images', 'local');
                    $exercise->images()->create([
                        'image_path' => $filePath,
                        'file_name' => $name
                    ]);
                }
            }
            if ($request->has('codeFiles')) {
                foreach ($fields['codeFiles'] as $file) {
                    $name= $file->getClientOriginalName();
                    $extension = $file->getClientOriginalExtension();
                    $filePath = $file->store('codeFiles', 'local');
                    $noExtensionFilePath = preg_replace('/\.[^.]+$/', '', $filePath);
                    $finalPath = $noExtensionFilePath . '.' . $extension;

                    Storage::disk('local')->move($filePath, $finalPath);

                    $exercise->files()->create([
                        'file_path' => $finalPath,
                        'file_name' => $name
                    ]);
                }

            }
            if ($request->has('testFiles')) {
                foreach ($fields['testFiles'] as $file) {
                    $name= $file->getClientOriginalName();
                    $extension = $file->getClientOriginalExtension();
                    $filePath = $file->store('testFiles', 'local');
                    $noExtensionFilePath = preg_replace('/\.[^.]+$/', '', $filePath);
                    $finalPath = $noExtensionFilePath . '.' . $extension;

                    // Rename the file to include the extension
                    Storage::disk('local')->move($filePath, $finalPath);

                    $exercise->Tests()->create([
                        'file_path' => $finalPath,
                        'file_name' => $name
                    ]);
                }

            }



            DB::commit();
            return response()->json(['exercise' => $exercise], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to create exercise'. $e], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id): JsonResponse
    {
        $service = new ExerciseAccessService();
        $result = $service->getExerciseWithFiles($id);

        return response()->json($result);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Exercise $exercise)
    {
        DB::beginTransaction();
        try {
            $fields = $request->validate([
                'title' => 'required|max:255',
                'description' => 'required',
                'images' => 'nullable|array',
                'codeFiles' => 'nullable|array',
                'testFiles' => 'nullable|array'
            ]);
            if ($request->has('pictures')) {
                foreach ($fields['pictures'] as $pictureFile) {
                    $filePath = $pictureFile->store('pictures', 'local'); // Save picture to storage

                    // Create the picture record
                    $exercise->images()->create([
                        'file_path' => $filePath
                    ]);
                }
            }
            $exercise->update($fields);
            DB::commit();
            return $exercise;
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to create exercise'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Exercise $exercise): JsonResponse
    {
        $exercise->delete();

        return response()->json(['message' => 'Exercise deleted']);
    }


}
