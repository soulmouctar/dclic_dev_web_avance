<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ContributionPayment extends Model
{
    protected $fillable = [
        'user_id',
        'year',
        'month',
        'amount',
        'payment_date',
        'payment_method',
        'reference',
    ];

    protected function casts(): array
    {
        return [
            'payment_date' => 'date',
            'amount' => 'decimal:2',
            'year' => 'integer',
            'month' => 'integer',
        ];
    }

    /**
     * Get the user that owns the contribution payment.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
