<?php

namespace App\Services;

use App\Models\Exercise;
use Illuminate\Support\Facades\Storage;

class ExerciseAccessService
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function getExerciseWithFiles($exerciseId){
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
