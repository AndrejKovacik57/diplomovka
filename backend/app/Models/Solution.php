<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Solution extends Model
{
    use HasFactory;

    public const STATUS_PENDING = 'pending';
    public const STATUS_RUNNING = 'running';
    public const STATUS_FINISHED = 'finished';
    public const STATUS_FAILED = 'failed';

    public const STATUSES = [
        self::STATUS_PENDING,
        self::STATUS_RUNNING,
        self::STATUS_FINISHED,
        self::STATUS_FAILED,
    ];

    protected $fillable = [
        'course_exercise_id',
        'user_id',
        'file_path',
        'file_name',
        'test_status',
        'test_output',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function courseExercise(): BelongsTo
    {
        return $this->belongsTo(CourseExercise::class);
    }
    public function testResults(): HasMany
    {
        return $this->hasMany(SolutionTestResult::class);
    }
}
