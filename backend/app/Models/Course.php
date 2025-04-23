<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'semester',
        'year',
    ];


    public function users(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(User::class);
    }
    public function exercises(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Exercise::class);
    }
    public function solutions(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Solutions::class);
    }
    public function enrollments(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(CourseEnrollment::class);
    }
    public function linkedUsers(): \Illuminate\Database\Eloquent\Collection
    {
        return User::query()->whereIn('uid', $this->enrollments()->pluck('uid'))->get();
    }
}
