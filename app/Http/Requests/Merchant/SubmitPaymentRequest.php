<?php

namespace App\Http\Requests\Merchant;

use Illuminate\Foundation\Http\FormRequest;

class SubmitPaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Strip dangerous characters from inputs before validation runs.
     * This prevents HTML/script injection and normalises digit-only fields.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            // Keep only digits for numeric-only fields
            'ipn'            => preg_replace('/\D/', '', $this->input('ipn', '')),
            'account_number' => preg_replace('/\D/', '', $this->input('account_number', '')),
            'phone'          => preg_replace('/[^\d+]/', '', $this->input('phone', '')),

            // Strip ALL HTML tags and null bytes; collapse whitespace
            'merchant_name'  => $this->sanitiseText($this->input('merchant_name', '')),
            'email'          => strtolower(trim(strip_tags($this->input('email', '')))),

            // Date: keep only safe characters
            'transaction_date' => preg_replace('/[^\d\-]/', '', $this->input('transaction_date', '')),
        ]);
    }

    public function rules(): array
    {
        return [
            // IPN — digits only, 1–12 characters
            'ipn'              => ['required', 'digits_between:1,12'],

            // Date — must not be in the future
            'transaction_date' => ['required', 'date', 'before_or_equal:today'],

            // Name — letters, spaces, apostrophes, hyphens, dots only (Unicode-safe)
            'merchant_name'    => [
                'required',
                'string',
                'min:2',
                'max:100',
                'regex:/^[\p{L}\p{M}\s\'\-\.]+$/u',
            ],

            // Email — strict RFC validation
            'email'            => ['required', 'email:rfc,dns', 'max:255'],

            // Phone — digits only, 10–15 characters (covers Nigerian mobile formats)
            'phone'            => ['required', 'digits_between:10,15'],

            // Bank — must be one of the allowed values
            'bank'             => ['required', 'in:wema_bank,alpha_morgan_bank'],

            // Account number — exactly 10 digits, no letters or symbols
            'account_number'   => ['required', 'digits:10'],

            // File — additional deep checks are in FileUploadService
            'proof_of_payment' => [
                'required',
                'file',
                'max:5120',
                'mimes:jpg,jpeg,png,pdf',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'ipn.required'              => 'IPN number is required.',
            'ipn.digits_between'        => 'IPN must be numbers only and no more than 12 digits.',
            'transaction_date.required' => 'Transaction date is required.',
            'transaction_date.before_or_equal' => 'Transaction date cannot be in the future.',
            'merchant_name.required'    => 'Full name is required.',
            'merchant_name.regex'       => 'Name must contain letters only — no numbers or special characters.',
            'merchant_name.min'         => 'Name must be at least 2 characters.',
            'merchant_name.max'         => 'Name must not exceed 100 characters.',
            'email.email'               => 'Please enter a valid email address.',
            'phone.digits_between'      => 'Phone number must be 10–15 digits with no spaces or symbols.',
            'bank.in'                   => 'Please select a valid bank.',
            'account_number.required'   => 'Account number is required.',
            'account_number.digits'     => 'Account number must be exactly 10 digits with no letters or symbols.',
            'proof_of_payment.required' => 'Please upload your proof of payment.',
            'proof_of_payment.mimes'    => 'Proof of payment must be a JPG, PNG, or PDF file.',
            'proof_of_payment.max'      => 'File size must not exceed 5MB.',
        ];
    }

    private function sanitiseText(string $value): string
    {
        // Remove null bytes, strip all HTML tags, decode HTML entities, trim whitespace
        $value = str_replace("\0", '', $value);
        $value = strip_tags($value);
        $value = html_entity_decode($value, ENT_QUOTES | ENT_HTML5, 'UTF-8');
        // Re-strip after entity decode (double-encoded attack)
        $value = strip_tags($value);
        return trim(preg_replace('/\s+/', ' ', $value));
    }
}
