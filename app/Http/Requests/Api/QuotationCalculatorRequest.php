<?php

namespace App\Http\Requests\Api;

use App\Enums\Currency;
use Illuminate\Foundation\Http\FormRequest;

class QuotationCalculatorRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'age' => ['required', 'string', 'regex:/^(\d{1,2},)*\d{1,2}$/'],
            'currency_id' => ['required', 'in:'.implode(',', Currency::values())],
            'start_date' => ['required', 'date', 'after:today'],
            'end_date' => ['required', 'date', 'after:start_date'],
        ];
    }

    public function messages(): array
    {
        return [
            'age.regex' => 'The age must be a comma-separated list of numbers.',
            'currency_id.in' => 'The currency must be one of: EUR, GBP, USD.',
        ];
    }
}
