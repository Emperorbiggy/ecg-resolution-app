<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Merchant;
use App\Models\PaymentResolution;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $stats = [
            'total_submissions'         => PaymentResolution::count(),
            'open_resolutions'          => PaymentResolution::where('resolution_status', 'open')->count(),
            'pending_verification'      => PaymentResolution::where('payment_status', 'pending')->count(),
            'payments_received'         => PaymentResolution::where('payment_status', 'received')->count(),
            'payments_resolved'         => PaymentResolution::where('resolution_status', 'resolved')->count(),
            'total_merchants'           => Merchant::count(),
            'total_accountants'         => User::where('role', 'accountant')->count(),
            'total_resolution_officers' => User::where('role', 'resolution_officer')->count(),
        ];

        $recentActivities = AuditLog::latest('created_at')
            ->take(15)
            ->get()
            ->map(fn ($log) => [
                'id'           => $log->id,
                'action_label' => $log->action_label,
                'description'  => $log->description,
                'user_name'    => $log->user_name,
                'user_role'    => $log->user_role,
                'ipn'          => $log->ipn,
                'created_at'   => $log->created_at->diffForHumans(),
            ]);

        return Inertia::render('SuperAdmin/Dashboard', compact('stats', 'recentActivities'));
    }
}
