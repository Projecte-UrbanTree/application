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
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'element_id' => 'required|integer',
            'date_birth' => 'required|date',
            'height' => 'required|numeric',
            'diameter' => 'required|numeric',
            'crown_width' => 'required|numeric',
            'crown_projection_area' => 'required|numeric',
            'root_surface_diameter' => 'required|numeric',
            'effective_root_area' => 'required|numeric',
            'height_estimation' => 'required|numeric',
            'unbalanced_crown' => 'required|integer',
            'overextended_branches' => 'required|integer',
            'cracks' => 'required|integer',
            'dead_branches' => 'required|integer',
            'inclination' => 'required|integer',
            'V_forks' => 'required|integer',
            'cavities' => 'required|integer',
            'bark_damage' => 'required|integer',
            'soil_lifting' => 'required|integer',
            'cut_damaged_roots' => 'required|integer',
            'basal_rot' => 'required|integer',
            'exposed_surface_roots' => 'required|integer',
            'wind' => 'required|integer',
            'drought' => 'required|integer',
            'status' => 'required|integer',
        ];
    }
}
