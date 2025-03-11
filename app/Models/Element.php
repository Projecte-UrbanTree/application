<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Element extends Model
{
    protected $fillable = [
        'description',
        'element_type_id',
        'tree_type_id',
        'point_id',
    ];

    public function point()
    {
        return $this->belongsTo(Point::class, 'point_id');
    }

    public function elementType()
    {
        return $this->belongsTo(ElementType::class, 'element_type_id');
    }

    public function treeType()
    {
        return $this->belongsTo(TreeType::class, 'tree_type_id');
    }

    public function incidences()
    {
        return $this->hasMany(Incidence::class, 'element_id');
    }

    public function eva()
    {
        return $this->hasOne(Eva::class)->nullable();
    }
}
