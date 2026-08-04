<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lesson extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'id',
        'title',
        'subtitle',
        'description',
        'unit_number',
        'status',
        'xp_reward',
        'estimated_minutes',
        'order_index',
        'color',
    ];

    protected $casts = [
        'unit_number' => 'integer',
        'xp_reward' => 'integer',
        'estimated_minutes' => 'integer',
        'order_index' => 'integer',
    ];
}
