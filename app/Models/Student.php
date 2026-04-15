<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Student extends Model
{
    protected $fillable = ['student_id', 'name', 'course', 'dept', 'year', 'initials'];

    public function logs(): HasMany
    {
        return $this->hasMany(LibraryLog::class);
    }

    /** Get initials for avatar display */
    public function getInitialsAttribute(): string
    {
        return collect(explode(' ', $this->name))
            ->map(fn($w) => strtoupper($w[0]))
            ->take(2)
            ->join('');
    }
}
