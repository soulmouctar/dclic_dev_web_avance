<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreContributionPaymentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->role === 'ADMIN';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'user_id' => 'required|exists:users,id',
            'year' => 'required|integer|min:2020|max:' . (date('Y') + 1),
            'month' => 'required|integer|min:1|max:12',
            'amount' => 'required|numeric|min:0',
            'payment_date' => 'required|date',
            'payment_method' => 'required|in:CASH,TRANSFER,OTHER',
            'reference' => 'nullable|string|max:255',
        ];
    }

    /**
     * Get custom error messages for validation rules.
     */
    public function messages(): array
    {
        return [
            'user_id.required' => 'Le membre est obligatoire.',
            'user_id.exists' => 'Le membre sélectionné n\'existe pas.',
            'year.required' => 'L\'année est obligatoire.',
            'year.integer' => 'L\'année doit être un nombre entier.',
            'year.min' => 'L\'année doit être supérieure à 2020.',
            'year.max' => 'L\'année ne peut pas être supérieure à l\'année prochaine.',
            'month.required' => 'Le mois est obligatoire.',
            'month.integer' => 'Le mois doit être un nombre entier.',
            'month.min' => 'Le mois doit être entre 1 et 12.',
            'month.max' => 'Le mois doit être entre 1 et 12.',
            'amount.required' => 'Le montant est obligatoire.',
            'amount.numeric' => 'Le montant doit être un nombre.',
            'amount.min' => 'Le montant doit être positif.',
            'payment_date.required' => 'La date de paiement est obligatoire.',
            'payment_date.date' => 'La date de paiement doit être une date valide.',
            'payment_method.required' => 'Le mode de paiement est obligatoire.',
            'payment_method.in' => 'Le mode de paiement doit être CASH, TRANSFER ou OTHER.',
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            if ($this->user_id && $this->year && $this->month) {
                $exists = \App\Models\ContributionPayment::where('user_id', $this->user_id)
                    ->where('year', $this->year)
                    ->where('month', $this->month)
                    ->exists();
                
                if ($exists) {
                    $validator->errors()->add('month', 'Un paiement existe déjà pour ce membre pour ce mois et cette année.');
                }
            }
        });
    }
}
