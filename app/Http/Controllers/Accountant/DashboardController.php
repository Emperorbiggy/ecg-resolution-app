<?php

namespace App\Http\Controllers\Accountant;

use App\Http\Controllers\Controller;
use App\Models\PaymentResolution;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $stats = [
            'total_pending'   => PaymentResolution::where('payment_status', 'pending')->count(),
            'total_received'  => PaymentResolution::where('payment_status', 'received')->count(),
            'total_reviewing' => PaymentResolution::where('resolution_status', 'reviewing')->count(),
        ];

        $recentPayments = PaymentResolution::with('receiver')
            ->latest()
            ->take(10)
            ->get()
            ->map(fn ($p) => [
                'id'               => $p->id,
                'ipn'              => $p->ipn,
                'merchant_name'    => $p->merchant_name,
                'bank_label'       => $p->bank_label,
                'created_at'       => $p->created_at->format('d M Y'),
                'resolution_status' => $p->resolution_status,
                'resolution_status_label' => $p->resolution_status_label,
                'payment_status'   => $p->payment_status,
                'payment_status_label' => $p->payment_status_label,
            ]);

        return Inertia::render('Accountant/Dashboard', compact('stats', 'recentPayments'));
    }
}
