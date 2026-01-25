<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ContributionPaymentController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes (no authentication required)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes (authentication required)
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    
    // Member routes (accessible by both ADMIN and MEMBER)
    Route::get('/contributions/current-status', [ContributionPaymentController::class, 'currentStatus']);
    Route::get('/contributions', [ContributionPaymentController::class, 'index']);
    
    // Admin only routes
    Route::middleware('admin')->group(function () {
        // User management
        Route::get('/members', [UserController::class, 'index']);
        Route::post('/members', [UserController::class, 'store']);
        Route::get('/members/{user}', [UserController::class, 'show']);
        Route::put('/members/{user}', [UserController::class, 'update']);
        Route::put('/members/{user}/change-password', [UserController::class, 'changePassword']);
        
        // Contribution payments management
        Route::post('/contributions', [ContributionPaymentController::class, 'store']);
        Route::get('/admin/stats', [ContributionPaymentController::class, 'adminStats']);
        Route::get('/admin/member-payment-stats', [ContributionPaymentController::class, 'memberPaymentStats']);
        Route::get('/admin/payment-trends', [ContributionPaymentController::class, 'paymentTrends']);
        Route::get('/admin/member-stats', [ContributionPaymentController::class, 'memberStats']);
        Route::get('/admin/contribution-trends', [ContributionPaymentController::class, 'contributionTrends']);
    });
});
