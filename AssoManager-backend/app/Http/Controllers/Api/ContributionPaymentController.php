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

        // Calculer les nouveaux membres ce mois
        $newMembersThisMonth = User::where('role', 'MEMBER')
                                  ->whereYear('created_at', $currentYear)
                                  ->whereMonth('created_at', $currentMonth)
                                  ->count();

        // Récupérer les activités récentes
        $recentPayments = ContributionPayment::with('user')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        $recentMembers = User::where('role', 'MEMBER')
            ->orderBy('created_at', 'desc')
            ->limit(3)
            ->get();

        $recentActivities = [];
        
        // Ajouter les paiements récents
        foreach ($recentPayments as $payment) {
            $recentActivities[] = [
                'type' => 'payment',
                'title' => 'Nouvelle cotisation',
                'description' => $payment->user->first_name . ' ' . $payment->user->last_name . ' - ' . $payment->amount . '€',
                'created_at' => $payment->created_at
            ];
        }
        
        // Ajouter les nouveaux membres
        foreach ($recentMembers as $member) {
            $recentActivities[] = [
                'type' => 'member',
                'title' => 'Nouveau membre',
                'description' => $member->first_name . ' ' . $member->last_name,
                'created_at' => $member->created_at
            ];
        }
        
        // Trier par date de création
        usort($recentActivities, function($a, $b) {
            return $b['created_at'] <=> $a['created_at'];
        });
        
        // Garder seulement les 5 plus récents
        $recentActivities = array_slice($recentActivities, 0, 5);

        return response()->json([
            'total_members' => $totalMembers,
            'active_members' => $activeMembers,
            'inactive_members' => $inactiveMembers,
            'new_members_this_month' => $newMembersThisMonth,
            'paid_this_month' => $paidThisMonth,
            'unpaid_this_month' => $totalMembers - $paidThisMonth,
            'total_amount_this_month' => $totalAmountThisMonth,
            'total_revenue' => $totalRevenue,
            'total_contributions' => $totalContributions,
            'current_month' => $currentMonth,
            'current_year' => $currentYear,
            'recent_activities' => $recentActivities,
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
            $totalPaid = $userPayments->sum('amount');
            $monthsPaid = $userPayments->count();
            $lastPayment = $userPayments->sortByDesc('payment_date')->first();
            
            // Déterminer le statut basé sur les paiements récents
            $isActive = $totalPaid > 0 && $monthsPaid > 0;
            
            return [
                'member_id' => $user->id,
                'member_name' => $user->first_name . ' ' . $user->last_name,
                'total_paid' => $totalPaid,
                'months_paid' => $monthsPaid,
                'last_payment_date' => $lastPayment ? $lastPayment->payment_date->format('Y-m-d') : null,
                'status' => $isActive ? 'ACTIVE' : 'INACTIVE',
                'average_monthly' => $monthsPaid > 0 ? round($totalPaid / $monthsPaid, 2) : 0
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

    public function memberStats(Request $request): JsonResponse
    {
        $year = $request->query('year', date('Y'));
        $status = $request->query('status', 'ALL');
        $sortBy = $request->query('sortBy', 'total_amount');

        $query = User::where('role', 'MEMBER')
            ->with(['contributionPayments' => function($q) use ($year) {
                $q->whereYear('payment_date', $year);
            }]);

        if ($status !== 'ALL') {
            $query->where('status', $status);
        }

        $members = $query->get();

        $memberStats = $members->map(function($member) {
            $totalAmount = $member->contributionPayments->sum('amount');
            $totalContributions = $member->contributionPayments->count();

            return [
                'member_id' => $member->id,
                'member_name' => $member->first_name . ' ' . $member->last_name,
                'member_email' => $member->email,
                'member_status' => $member->status,
                'total_amount' => (float) $totalAmount,
                'total_contributions' => $totalContributions,
                'average_amount' => $totalContributions > 0 ? (float) ($totalAmount / $totalContributions) : 0,
            ];
        });

        // Sort the results
        $memberStats = $memberStats->sortBy($sortBy === 'member_name' ? 'member_name' : $sortBy)->values();

        return response()->json($memberStats);
    }

    public function contributionTrends(Request $request): JsonResponse
    {
        $year = $request->query('year', date('Y'));
        $type = $request->query('type', 'monthly');

        if ($type === 'yearly') {
            $trends = ContributionPayment::selectRaw('YEAR(payment_date) as period, COUNT(*) as total_contributions, SUM(amount) as total_amount')
                ->groupBy('period')
                ->orderBy('period')
                ->get();
        } else {
            $trends = ContributionPayment::selectRaw('MONTH(payment_date) as period, COUNT(*) as total_contributions, SUM(amount) as total_amount')
                ->whereYear('payment_date', $year)
                ->groupBy('period')
                ->orderBy('period')
                ->get();
        }

        $formattedTrends = $trends->map(function($trend) {
            return [
                'period' => (int) $trend->period,
                'total_contributions' => (int) $trend->total_contributions,
                'total_amount' => (float) $trend->total_amount,
            ];
        });

        return response()->json([
            'trends' => $formattedTrends,
        ]);
    }
}
