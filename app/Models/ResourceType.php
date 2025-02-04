<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ResourceType extends Model
{
    protected $fillable = [
        'name',
        'description',
    ];

    public function resources()
    {
        return $this->hasMany(Resource::class, 'resource_type_id');
    }
}
