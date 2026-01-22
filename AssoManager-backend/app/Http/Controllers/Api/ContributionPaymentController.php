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
        $activeMembers = User::where('role', 'MEMBER')->where('status', 'ACTIVE')->count();
        $inactiveMembers = User::where('role', 'MEMBER')->where('status', 'INACTIVE')->count();
        
        $paidThisMonth = ContributionPayment::where('year', $currentYear)
                                          ->where('month', $currentMonth)
                                          ->count();

        $totalAmountThisMonth = ContributionPayment::where('year', $currentYear)
                                                 ->where('month', $currentMonth)
                                                 ->sum('amount');

        $totalRevenue = ContributionPayment::where('year', $currentYear)->sum('amount');
        $totalContributions = ContributionPayment::where('year', $currentYear)->count();

        return response()->json([
            'total_members' => $totalMembers,
            'active_members' => $activeMembers,
            'inactive_members' => $inactiveMembers,
            'paid_this_month' => $paidThisMonth,
            'unpaid_this_month' => $totalMembers - $paidThisMonth,
            'total_amount_this_month' => $totalAmountThisMonth,
            'total_revenue' => $totalRevenue,
            'total_contributions' => $totalContributions,
            'current_month' => $currentMonth,
            'current_year' => $currentYear,
        ]);
    }

    /**
     * Get member payment statistics for admin
     */
    public function memberPaymentStats(Request $request): JsonResponse
    {
        $year = $request->get('year', now()->year);
        $month = $request->get('month');

        $query = ContributionPayment::with('user')
            ->where('year', $year);

        if ($month) {
            $query->where('month', $month);
        }

        $payments = $query->get();

        $memberStats = $payments->groupBy('user_id')->map(function ($userPayments) {
            $user = $userPayments->first()->user;
            return [
                'member_id' => $user->id,
                'member_name' => $user->first_name . ' ' . $user->last_name,
                'total_paid' => $userPayments->sum('amount'),
                'months_paid' => $userPayments->count(),
            ];
        })->values();

        return response()->json([
            'member_stats' => $memberStats,
        ]);
    }

    /**
     * Get payment trends for admin
     */
    public function paymentTrends(Request $request): JsonResponse
    {
        $year = $request->get('year', now()->year);

        $trends = ContributionPayment::where('year', $year)
            ->selectRaw('month, SUM(amount) as total_amount, COUNT(*) as member_count, AVG(amount) as average_per_member')
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(function ($trend) {
                return [
                    'month' => $trend->month,
                    'total_amount' => (float) $trend->total_amount,
                    'member_count' => $trend->member_count,
                    'average_per_member' => (float) $trend->average_per_member,
                ];
            });

        return response()->json([
            'trends' => $trends,
        ]);
    }
}
