<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ExerciseRequest extends FormRequest
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
            'title' => 'required|max:255',
            'description' => 'required',
            'images' => 'nullable|array',
            'images.*' => 'file|mimes:jpg,jpeg,png,gif|max:10240', // Set a reasonable max size
            'codeFiles' => 'nullable|array',
            'codeFiles.*' => 'file|max:10240',
            'testFiles' => 'nullable|array',
            'testFiles.*' => 'file|max:10240',
            'csvFiles' => 'nullable|array',
            'csvFiles.*' => 'file|max:10240'
        ];
    }
}
