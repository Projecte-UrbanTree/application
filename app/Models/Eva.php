<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Eva extends Model
{
    protected $table = 'eva';

    protected $fillable = [
        'element_id',
        'date_birth',
        'height',
        'diameter',
        'crown_width',
        'crown_projection_area',
        'root_surface_diameter',
        'effective_root_area',
        'height_estimation',
        'unbalanced_crown',
        'overextended_branches',
        'cracks',
        'dead_branches',
        'inclination',
        'V_forks',
        'cavities',
        'bark_damage',
        'soil_lifting',
        'cut_damaged_roots',
        'basal_rot',
        'exposed_surface_roots',
        'wind',
        'drought',
    ];

    public function element()
    {
        return $this->belongsTo(Element::class, 'element_id');
    }
}
