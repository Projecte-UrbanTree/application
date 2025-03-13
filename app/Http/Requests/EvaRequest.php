<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EvaRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            
            'element_id' => 'nullable',
            'date_birth' => 'nullable',
            'height' => 'nullable',
            'diameter' => 'nullable',
            'crown_width' => 'nullable',
            'crown_projection_area' => 'nullable',
            'root_surface_diameter' => 'nullable',
            'effective_root_area' => 'nullable',
            'height_estimation' => 'nullable',
            'unbalanced_crown' => 'nullable',
            'overextended_branches' => 'nullable',
            'cracks' => 'nullable',
            'dead_branches' => 'nullable',
            'inclination' => 'nullable',
            'V_forks' => 'nullable',
            'cavities' => 'nullable',
            'bark_damage' => 'nullable',
            'soil_lifting' => 'nullable',
            'cut_damaged_roots' => 'nullable',
            'basal_rot' => 'nullable',
            'exposed_surface_roots' => 'nullable',
            'wind' => 'nullable',
            'drought' => 'nullable',
            'status' => 'nullable',
        ];
    }
}
