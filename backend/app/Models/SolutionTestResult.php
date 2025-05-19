<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SolutionTestResult extends Model
{
    use HasFactory;

    protected $fillable = [
        'solution_id',
        'test_name',
        'status',
        'message',
    ];

    public const STATUS_PASSED = 'passed';
    public const STATUS_FAILED = 'failed';

    public const STATUSES = [
        self::STATUS_PASSED,
        self::STATUS_FAILED,
    ];

    public function solution(): BelongsTo
    {
        return $this->belongsTo(Solution::class);
    }
}
