<?php

use App\Http\Controllers\Merchant\MerchantController;
use App\Http\Controllers\Merchant\PaymentController as MerchantPaymentController;
use App\Http\Controllers\Accountant\DashboardController as AccountantDashboard;
use App\Http\Controllers\Accountant\PaymentReviewController;
use App\Http\Controllers\ResolutionOfficer\DashboardController as OfficerDashboard;
use App\Http\Controllers\ResolutionOfficer\PaymentResolutionController;
use App\Http\Controllers\SuperAdmin\DashboardController as AdminDashboard;
use App\Http\Controllers\SuperAdmin\PaymentController as AdminPaymentController;
use App\Http\Controllers\SuperAdmin\UserController;
use App\Http\Controllers\SuperAdmin\AuditLogController;
use Illuminate\Support\Facades\Route;

// ── MERCHANT (PUBLIC) ──────────────────────────────────────────────────────────
Route::middleware(['throttle:60,1'])->group(function () {
    Route::get('/', [MerchantPaymentController::class, 'welcome'])->name('merchant.welcome');
    Route::get('/submit', fn() => inertia('Merchant/Submit'))->name('merchant.submit');
    Route::post('/payments', [MerchantPaymentController::class, 'store'])->name('merchant.payments.store');
    Route::get('/payments', [MerchantPaymentController::class, 'index'])->name('merchant.payments.index');
    Route::get('/payments/{payment}', [MerchantPaymentController::class, 'show'])->name('merchant.payments.show');
    Route::post('/merchants', [MerchantController::class, 'store'])->name('merchant.store');
});

// ── ACCOUNTANT ────────────────────────────────────────────────────────────────
Route::middleware(['auth', 'role:accountant,super_admin'])
    ->prefix('accountant')
    ->name('accountant.')
    ->group(function () {
        Route::get('/', [AccountantDashboard::class, 'index'])->name('dashboard');
        Route::get('/payments', [PaymentReviewController::class, 'index'])->name('payments');
        Route::get('/payments/received', [PaymentReviewController::class, 'received'])->name('payments.received');
        Route::get('/payments/{payment}', [PaymentReviewController::class, 'show'])->name('payments.show');
        Route::put('/payments/{payment}/review', [PaymentReviewController::class, 'review'])->name('payments.review');
    });

// ── RESOLUTION OFFICER ────────────────────────────────────────────────────────
Route::middleware(['auth', 'role:resolution_officer,super_admin'])
    ->prefix('resolution-officer')
    ->name('resolution.')
    ->group(function () {
        Route::get('/', [OfficerDashboard::class, 'index'])->name('dashboard');
        Route::get('/payments', [PaymentResolutionController::class, 'index'])->name('payments');
        Route::get('/payments/resolved', [PaymentResolutionController::class, 'resolved'])->name('payments.resolved');
        Route::get('/payments/{payment}', [PaymentResolutionController::class, 'show'])->name('payments.show');
        Route::put('/payments/{payment}/resolve', [PaymentResolutionController::class, 'resolve'])->name('payments.resolve');
    });

// ── SUPER ADMIN ───────────────────────────────────────────────────────────────
Route::middleware(['auth', 'role:super_admin'])
    ->prefix('super-admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/', [AdminDashboard::class, 'index'])->name('dashboard');

        Route::get('/payments', [AdminPaymentController::class, 'index'])->name('payments');
        Route::get('/payments/{payment}', [AdminPaymentController::class, 'show'])->name('payments.show');

        Route::get('/users', [UserController::class, 'index'])->name('users');
        Route::post('/users', [UserController::class, 'store'])->name('users.store');
        Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
        Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
        Route::put('/users/{user}/toggle-active', [UserController::class, 'toggleActive'])->name('users.toggle-active');
        Route::put('/users/{user}/reset-password', [UserController::class, 'resetPassword'])->name('users.reset-password');

        Route::get('/audit-logs', [AuditLogController::class, 'index'])->name('audit-logs');
    });

// ── AUTH REDIRECT AFTER LOGIN ─────────────────────────────────────────────────
Route::middleware('auth')->get('/dashboard', function () {
    $user = auth()->user();
    return match ($user->role) {
        'super_admin'        => redirect()->route('admin.dashboard'),
        'accountant'         => redirect()->route('accountant.dashboard'),
        'resolution_officer' => redirect()->route('resolution.dashboard'),
        default              => redirect()->route('merchant.welcome'),
    };
})->name('dashboard');

require __DIR__ . '/auth.php';
