<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Solutions extends Model
{
    use HasFactory;
    protected $fillable = [
        'course_exercise_id',
        'user_id',
        'file_path',
        'file_name',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function courseExercise(): BelongsTo
    {
        return $this->belongsTo(CourseExercise::class);
    }
}
