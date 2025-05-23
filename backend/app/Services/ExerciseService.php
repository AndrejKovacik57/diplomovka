<?php

namespace App\Services;

use App\Models\Exercise;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class ExerciseService
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function createExercise(array $fields): Exercise
    {
        return DB::transaction(function () use ($fields) {
            $exercise = Exercise::query()->create([
                'title' => $fields['title'],
                'description' => $fields['description'],
            ]);

            $this->handleImages($exercise, $fields);
            $this->handleCodeFiles($exercise, $fields);
            $this->handleTestFile($exercise, $fields);

            return $exercise;
        });
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

    public function updateExercise(array $fields, Exercise $exercise): Exercise
    {
        return DB::transaction(function () use ($fields, $exercise) {

            $exercise->update([
                'title' => $fields['title'],
                'description' => $fields['description'],
            ]);

            if (isset($fields['images'])) {
                foreach ($exercise->images as $image) {
                    Storage::disk('local')->delete($image->image_path);
                    $image->delete();
                }

                $this->handleImages($exercise, $fields);
            }

            if (isset($fields['codeFiles'])) {
                foreach ($exercise->files as $file) {
                    Storage::disk('local')->delete($file->file_path);
                    $file->delete();
                }

                $this->handleCodeFiles($exercise, $fields);
            }

            if (isset($fields['testFile'])) {
                if ($exercise->test) {
                    Storage::disk('local')->delete($exercise->test->file_path);
                    $exercise->test()->delete();
                }

                $this->handleTestFile($exercise, $fields);
            }
            $exercise->save();
            return $exercise->fresh();
        });
    }

    public function getExerciseWithFiles($exerciseId): array
    {
        $exercise = Exercise::with(['images', 'files'])->findOrFail($exerciseId);

        $images = $exercise->images->map(function ($image) {
            return [
                'file_name' => $image->file_name,
                'file_data' => base64_encode(Storage::get($image->image_path)), // Convert image to Base64
            ];
        });

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
