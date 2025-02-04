<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LandingFormData extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone',
        'message',
    ];
}
