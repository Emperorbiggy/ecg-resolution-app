<?php

namespace App\Http\Controllers\ResolutionOfficer;

use App\Http\Controllers\Controller;
use App\Models\PaymentResolution;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $stats = [
            'awaiting_resolution' => PaymentResolution::where('payment_status', 'received')
                ->where('resolution_status', 'reviewing')
                ->count(),
            'resolved_today'      => PaymentResolution::where('resolution_status', 'resolved')
                ->whereDate('resolved_at', today())
                ->count(),
            'total_resolved'      => PaymentResolution::where('resolution_status', 'resolved')->count(),
        ];

        $recentPayments = PaymentResolution::where('payment_status', 'received')
            ->with('resolver')
            ->latest()
            ->take(10)
            ->get()
            ->map(fn ($p) => [
                'id'                      => $p->id,
                'ipn'                     => $p->ipn,
                'merchant_name'           => $p->merchant_name,
                'bank_label'              => $p->bank_label,
                'created_at'              => $p->created_at->format('d M Y'),
                'resolution_status'       => $p->resolution_status,
                'resolution_status_label' => $p->resolution_status_label,
                'payment_status'          => $p->payment_status,
                'payment_status_label'    => $p->payment_status_label,
            ]);

        return Inertia::render('ResolutionOfficer/Dashboard', compact('stats', 'recentPayments'));
    }
}
