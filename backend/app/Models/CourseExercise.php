<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CourseExercise extends Model
{
    use HasFactory;

    protected $table = 'course_exercise'; // explicit because it's a pivot

    protected $fillable = [
        'course_id',
        'exercise_id',
        'start',
        'end',
    ];

    public function course():BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function exercise(): BelongsTo
    {
        return $this->belongsTo(Exercise::class);
    }

    public function solutions(): HasMany
    {
        return $this->hasMany(Solution::class);
    }
}
