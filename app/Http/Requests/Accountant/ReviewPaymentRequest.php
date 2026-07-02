<?php

namespace App\Http\Requests\Accountant;

use Illuminate\Foundation\Http\FormRequest;

class ReviewPaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasRole(['accountant', 'super_admin']);
    }

    public function rules(): array
    {
        return [
            'verdict'  => ['required', 'in:received,pending,other'],
            'comment'  => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'verdict.required' => 'Please select a verification result.',
            'verdict.in'       => 'Invalid verification result.',
        ];
    }
}
