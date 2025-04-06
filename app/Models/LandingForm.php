<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class LandingForm
 *
 * Represents a landing form submission in the application.
 */
class LandingForm extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone',
        'message',
    ];
}
