<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Incidence
 *
 * Represents an incidence or issue in the application.
 */
class Incidence extends Model
{
    protected $fillable = [
        'name',
        'description',
        'status',
        'element_id',
    ];

    /**
     * Get the element associated with the incidence.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function elements()
    {
        return $this->belongsTo(Element::class, 'element_id');
    }
}
