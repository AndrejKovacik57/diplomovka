<?php

namespace App\Services;

use App\Http\Requests\ExerciseRequest;
use App\Models\Exercise;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ExerciseService
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * @throws Exception
     */
    public function createExercise(array $fields): Exercise
    {
        DB::beginTransaction();

        try {
            $exercise = Exercise::query()->create([
                'title' => $fields['title'],
                'description' => $fields['description'],
                'user_id' => Auth::id(),
            ]);

            $this->handleImages($exercise, $fields);
            $this->handleCodeFiles($exercise, $fields);
            $this->handleTestFile($exercise, $fields);

            DB::commit();

            return $exercise;

        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Exercise creation failed: ' . $e->getMessage());
            throw $e;
        }
    }
    protected function handleImages(Exercise $exercise, array $fields): void
    {
        foreach ($fields['images'] as $pictureFile) {
            $name = $pictureFile->getClientOriginalName();
            $filePath = $pictureFile->store('images', 'local');

            $exercise->images()->create([
                'image_path' => $filePath,
                'file_name' => $name,
            ]);
        }
    }

    protected function handleCodeFiles(Exercise $exercise, array $fields): void
    {
        foreach ($fields['codeFiles'] as $file) {
            $name = $file->getClientOriginalName();
            $extension = $file->getClientOriginalExtension();
            $filePath = $file->store('codeFiles', 'local');
            $finalPath = preg_replace('/\.[^.]+$/', '', $filePath) . '.' . $extension;

            Storage::disk('local')->move($filePath, $finalPath);

            $exercise->files()->create([
                'file_path' => $finalPath,
                'file_name' => $name,
            ]);
        }
    }

    protected function handleTestFile(Exercise $exercise, array $fields): void
    {
        $file = $fields['testFile'];
        $name = $file->getClientOriginalName();
        $extension = $file->getClientOriginalExtension();
        $filePath = $file->store('testFiles', 'local');
        $finalPath = preg_replace('/\.[^.]+$/', '', $filePath) . '.' . $extension;

        Storage::disk('local')->move($filePath, $finalPath);

        $exercise->test()->create([
            'file_path' => $finalPath,
            'file_name' => $name,
        ]);
    }

    /**
     * @throws Exception
     */
    public function updateExercise(array $fields, Exercise $exercise): Exercise
    {
        DB::beginTransaction();
        try {

            foreach ($fields['pictures'] as $pictureFile) {
                $filePath = $pictureFile->store('pictures', 'local');
                $exercise->images()->create(['file_path' => $filePath]);
            }

            $exercise->update($fields);

            DB::commit();
            return $exercise;

        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Exercise update failed: ' . $e->getMessage());
            throw $e;
        }
    }
    public function getExerciseWithFiles($exerciseId): array
    {
        $exercise = Exercise::with(['images', 'files'])->findOrFail($exerciseId);

        // Transform images to include actual file data
        $images = $exercise->images->map(function ($image) {
            return [
                'file_name' => $image->file_name,
                'file_data' => base64_encode(Storage::get($image->image_path)), // Convert image to Base64
            ];
        });

        // Transform files to include actual file data
        $files = $exercise->files->map(function ($file) {
            return [
                'file_name' => $file->file_name,
                'file_data' => base64_encode(Storage::get($file->file_path)), // Convert file to Base64
            ];
        });
        return [
            'exercise' => [
                'id' => $exercise->id,
                'title' => $exercise->title,
                'description' => $exercise->description,
                'created_at' => $exercise->created_at,
                'updated_at' => $exercise->updated_at,
            ],
            'images' => $images,
            'files' => $files,
        ];
    }
}
