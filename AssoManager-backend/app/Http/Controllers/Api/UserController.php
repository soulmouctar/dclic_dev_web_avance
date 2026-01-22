<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Display a listing of members (Admin only)
     */
    public function index(Request $request): JsonResponse
    {
        $query = User::where('role', 'MEMBER');

        // Search functionality
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $members = $query->paginate(20);

        return response()->json([
            'members' => $members->items(),
            'pagination' => [
                'current_page' => $members->currentPage(),
                'last_page' => $members->lastPage(),
                'per_page' => $members->perPage(),
                'total' => $members->total(),
            ]
        ]);
    }

    /**
     * Display the specified member with payment history (Admin only)
     */
    public function show(User $user): JsonResponse
    {
        $user->load('contributionPayments');

        return response()->json([
            'member' => [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'status' => $user->status,
                'created_at' => $user->created_at,
            ],
            'payments' => $user->contributionPayments->map(function ($payment) {
                return [
                    'id' => $payment->id,
                    'year' => $payment->year,
                    'month' => $payment->month,
                    'amount' => $payment->amount,
                    'payment_date' => $payment->payment_date,
                    'payment_method' => $payment->payment_method,
                    'reference' => $payment->reference,
                ];
            })
        ]);
    }

    /**
     * Update member status (Admin only)
     */
    public function update(Request $request, User $user): JsonResponse
    {
        $request->validate([
            'status' => 'required|in:ACTIVE,INACTIVE'
        ]);

        $user->update([
            'status' => $request->status
        ]);

        return response()->json([
            'message' => 'Statut du membre mis à jour',
            'member' => [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'status' => $user->status,
            ]
        ]);
    }
}
