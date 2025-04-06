<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Point
 *
 * Represents a geographical point in the application.
 */
class Point extends Model
{
    protected $fillable = [
        'latitude',
        'longitude',
        'type',
        'zone_id',
    ];

    /**
     * Get the zone associated with the point.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function zones()
    {
        return $this->belongsTo(Zone::class, 'zone_id');
    }

    /**
     * Get the elements associated with the point.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function elements()
    {
        return $this->hasMany(Element::class, 'point_id');
    }
}
