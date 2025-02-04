<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Point extends Model
{
    protected $fillable = [
        'latitude',
        'longitude',
        'type',
        'zone_id',
    ];

    public function zones()
    {
        return $this->belongsTo(Zone::class, 'zone_id');
    }

    public function elements()
    {
        return $this->hasMany(Element::class, 'point_id');
    }
}
