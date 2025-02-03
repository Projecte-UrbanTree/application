<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Incidence extends Model
{
    protected $fillable = [
        'name',
        'description',
        'status',
        'element_id',
    ];

    public function elements()
    {
        return $this->belongsTo(Element::class, 'element_id');
    }
}
