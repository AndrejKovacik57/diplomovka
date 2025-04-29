<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Exercise extends Model
{
    use HasFactory;
    protected $fillable = [
        'title',
        'description'
    ];

    public function images(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(images::class);
    }
    public function files(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(files::class);
    }
    public function tests(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Tests::class);
    }

    public function courses(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Course::class, 'course_exercise');
    }

    public function solutions(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Solutions::class);
    }


}
