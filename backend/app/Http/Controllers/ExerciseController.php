<?php

namespace App\Http\Controllers;

use App\Models\Exercise;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ExerciseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Exercise::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        Log::info('Step 1: Starting store function.');
        Log::info('Step 1.5: Request data before validation.', ['request' => $request->all(), 'files' => $request->allFiles()]);
        Log::info('Step 1.6: MIME types of uploaded files.');
        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                Log::info('File MIME type:', ['name' => $file->getClientOriginalName(), 'mime' => $file->getMimeType()]);
            }
        }


        DB::beginTransaction();
        try {
            $fields = $request->validate([
                'title' => 'required|max:255',
                'description' => 'required',
                'images' => 'nullable|array',
                'images.*' => 'required|file|mimes:jpg,jpeg,png,gif|max:10240', // Set a reasonable max size
                'files' => 'nullable|array',
                'files.*' => 'required|file|max:10240',
            ]);
            Log::info('Step 2: Fields validated.', ['fields' => $fields]);
            $exercise = Exercise::create($fields);
            Log::info('Step 3: Exercise created.', ['exercise_id' => $exercise->id]);

            if ($request->has('images')) {
                Log::info('Step 4: Processing images.');
                foreach ($fields['images'] as $pictureFile) {
                    $filePath = $pictureFile->store('images', 'local'); // Save picture to storage
                    Log::info('Step 4.1: Image stored.', ['file_path' => $filePath]);
                    $exercise->images()->create([
                        'image_path' => $filePath
                    ]);
                    Log::info('Step 4.2: Image associated with exercise.');
                }
            }
            if ($request->has('files')) {
                Log::info('Step 5: Processing files.');
                foreach ($fields['files'] as $file) {
                    $extension = $file->getClientOriginalExtension();
                    $filePath = $file->store('files', 'local');
                    $noExtensionFilePath = preg_replace('/\.[^.]+$/', '', $filePath);
                    $finalPath = $noExtensionFilePath . '.' . $extension;

                    // Rename the file to include the extension
                    Storage::disk('local')->move($filePath, $finalPath);

                    $exercise->files()->create([
                        'file_path' => $finalPath
                    ]);
                    Log::info('Step 5.2: File associated with exercise.');
                }

            }

            DB::commit();
            Log::info('Step 6: Transaction committed.');
            return $exercise;
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to create exercise'. $e], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Exercise $exercise)
    {
        return $exercise;
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
    //            'images.*' => 'file|image|max:2048',
                'files' => 'nullable|array'
    //            'files.*' => 'file|image|max:2048',
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
    public function destroy(Exercise $exercise)
    {
        $exercise->delete();

        return ['message' => 'Exercise deleted'];
    }
}
