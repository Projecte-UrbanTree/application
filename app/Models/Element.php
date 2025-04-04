<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Element
 *
 * Represents an element in the application.
 *
 * @package App\Models
 */
class Element extends Model
{
    protected $fillable = [
        'description',
        'element_type_id',
        'tree_type_id',
        'point_id',
    ];

    /**
     * Get the point associated with the element.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function point()
    {
        return $this->belongsTo(Point::class, 'point_id');
    }

    /**
     * Get the element type associated with the element.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function elementType()
    {
        return $this->belongsTo(ElementType::class, 'element_type_id');
    }

    /**
     * Get the tree type associated with the element.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function treeType()
    {
        return $this->belongsTo(TreeType::class, 'tree_type_id');
    }

    /**
     * Get the incidences associated with the element.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function incidences()
    {
        return $this->hasMany(Incidence::class, 'element_id');
    }

    /**
     * Get the evaluation (Eva) associated with the element.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function eva()
    {
        return $this->hasOne(Eva::class);
    }
}
