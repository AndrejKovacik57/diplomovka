<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SolutionRequest extends FormRequest
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
            'exerciseId' => 'required|integer',
            'courseId' => 'required|integer',
            'codeFile' => 'required|file|max:10240',
        ];
    }

}
