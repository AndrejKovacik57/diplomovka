<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Exercise extends Model
{
    use HasFactory;
    protected $fillable = [
        'title',
        'description'
    ];

    public function images(): HasMany
    {
        return $this->hasMany(images::class);
    }
    public function files(): HasMany
    {
        return $this->hasMany(files::class);
    }
    public function tests(): HasMany
    {
        return $this->hasMany(Tests::class);
    }

    public function courses(): BelongsToMany
    {
        return $this->belongsToMany(Course::class, 'course_exercise');
    }

    public function courseExercises(): HasMany
    {
        return $this->hasMany(CourseExercise::class);
    }


}
