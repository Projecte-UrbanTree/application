<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LandingForm extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone',
        'message',
    ];
}
