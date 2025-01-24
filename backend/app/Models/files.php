<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class files extends Model
{
    use HasFactory;
    protected $fillable = [
        'exercise_id',
        'file_path'
    ];

    public function exercise(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(exercise::class);
    }
}
