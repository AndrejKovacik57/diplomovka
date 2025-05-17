<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Course extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'semester',
        'year',
    ];


    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class);
    }
    public function enrollments(): HasMany
    {
        return $this->hasMany(CourseEnrollment::class);
    }
    public function courseExercises(): HasMany
    {
        return $this->hasMany(CourseExercise::class);
    }
    public function exercises(): BelongsToMany
    {
        return $this->belongsToMany(Exercise::class, 'course_exercise')
            ->withPivot('id' ,'start', 'end');
    }

}
