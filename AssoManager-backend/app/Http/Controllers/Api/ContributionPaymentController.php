<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreContributionPaymentRequest;
use App\Models\ContributionPayment;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContributionPaymentController extends Controller
{
    /**
     * Display a listing of contribution payments
     * Admin: global history with filters
     * Member: personal history
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $query = ContributionPayment::with('user');

        // If member, only show their payments
        if ($user->role === 'MEMBER') {
            $query->where('user_id', $user->id);
        }

        // Filters
        if ($request->has('year')) {
            $query->where('year', $request->year);
        }

        if ($request->has('month')) {
            $query->where('month', $request->month);
        }

        if ($request->has('user_id') && $user->role === 'ADMIN') {
            $query->where('user_id', $request->user_id);
        }

        $payments = $query->orderBy('year', 'desc')
                         ->orderBy('month', 'desc')
                         ->paginate(20);

        return response()->json([
            'payments' => $payments->items(),
            'pagination' => [
                'current_page' => $payments->currentPage(),
                'last_page' => $payments->lastPage(),
                'per_page' => $payments->perPage(),
                'total' => $payments->total(),
            ]
        ]);
    }

    /**
     * Store a new contribution payment (Admin only)
     */
    public function store(StoreContributionPaymentRequest $request): JsonResponse
    {
        $payment = ContributionPayment::create($request->validated());

        return response()->json([
            'message' => 'Paiement enregistré avec succès',
            'payment' => [
                'id' => $payment->id,
                'user_id' => $payment->user_id,
                'year' => $payment->year,
                'month' => $payment->month,
                'amount' => $payment->amount,
                'payment_date' => $payment->payment_date,
                'payment_method' => $payment->payment_method,
                'reference' => $payment->reference,
            ]
        ], 201);
    }

    /**
     * Get member's contribution status for current month
     */
    public function currentStatus(Request $request): JsonResponse
    {
        $user = $request->user();
        $currentYear = now()->year;
        $currentMonth = now()->month;

        $payment = ContributionPayment::where('user_id', $user->id)
                                    ->where('year', $currentYear)
                                    ->where('month', $currentMonth)
                                    ->first();

        $totalPaidThisYear = ContributionPayment::where('user_id', $user->id)
                                              ->where('year', $currentYear)
                                              ->count();

        return response()->json([
            'current_month' => [
                'year' => $currentYear,
                'month' => $currentMonth,
                'is_paid' => $payment !== null,
                'payment' => $payment ? [
                    'amount' => $payment->amount,
                    'payment_date' => $payment->payment_date,
                    'payment_method' => $payment->payment_method,
                ] : null
            ],
            'year_summary' => [
                'year' => $currentYear,
                'months_paid' => $totalPaidThisYear,
                'total_months' => 12
            ]
        ]);
    }

    /**
     * Get admin dashboard stats
     */
    public function adminStats(): JsonResponse
    {
        $currentYear = now()->year;
        $currentMonth = now()->month;

        $totalMembers = User::where('role', 'MEMBER')->count();
        
        $paidThisMonth = ContributionPayment::where('year', $currentYear)
                                          ->where('month', $currentMonth)
                                          ->count();

        $totalAmountThisMonth = ContributionPayment::where('year', $currentYear)
                                                 ->where('month', $currentMonth)
                                                 ->sum('amount');

        return response()->json([
            'total_members' => $totalMembers,
            'paid_this_month' => $paidThisMonth,
            'unpaid_this_month' => $totalMembers - $paidThisMonth,
            'total_amount_this_month' => $totalAmountThisMonth,
            'current_month' => $currentMonth,
            'current_year' => $currentYear,
        ]);
    }
}
