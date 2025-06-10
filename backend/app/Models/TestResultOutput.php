<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TestResultOutput extends Model
{
    use HasFactory;

    protected $fillable = [
        'solution_test_result_id',
        'input',
        'expected_output',
        'actual_output',
        'subtest_status',
    ];

    public const STATUS_PASS = 'passed';
    public const STATUS_FAIL = 'failed';

    public const STATUSES = [
        self::STATUS_PASS,
        self::STATUS_FAIL,
    ];

    protected $casts = [
        'input' => 'array',
        'expected_output' => 'array',
        'actual_output' => 'array',
    ];

    public function solutionTestResult(): BelongsTo
    {
        return $this->belongsTo(SolutionTestResult::class);
    }
}
