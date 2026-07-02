<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\PaymentResolution;
use App\Services\AuditLogService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    public function index(Request $request): Response
    {
        $query = PaymentResolution::with(['receiver', 'resolver']);

        if ($search = $request->get('search')) {
            $query->where('ipn', 'like', "%{$search}%")
                  ->orWhere('merchant_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
        }

        if ($status = $request->get('resolution_status')) {
            $query->where('resolution_status', $status);
        }

        if ($payment_status = $request->get('payment_status')) {
            $query->where('payment_status', $payment_status);
        }

        if ($bank = $request->get('bank')) {
            $query->where('bank', $bank);
        }

        $payments = $query->latest()->paginate(20)->through(fn ($p) => [
            'id'                      => $p->id,
            'ipn'                     => $p->ipn,
            'merchant_name'           => $p->merchant_name,
            'email'                   => $p->email,
            'bank_label'              => $p->bank_label,
            'created_at'              => $p->created_at->format('d M Y'),
            'resolution_status'       => $p->resolution_status,
            'resolution_status_label' => $p->resolution_status_label,
            'payment_status'          => $p->payment_status,
            'payment_status_label'    => $p->payment_status_label,
            'receiver_name'           => $p->receiver?->name,
            'resolver_name'           => $p->resolver?->name,
        ]);

        return Inertia::render('SuperAdmin/Payments', [
            'payments' => $payments,
            'filters'  => $request->only('search', 'resolution_status', 'payment_status', 'bank'),
        ]);
    }

    public function show(PaymentResolution $payment): Response
    {
        $timeline = AuditLogService::getTimeline($payment->ipn);

        return Inertia::render('SuperAdmin/PaymentDetail', [
            'payment' => [
                'id'                      => $payment->id,
                'ipn'                     => $payment->ipn,
                'transaction_date'        => $payment->transaction_date->format('d M Y'),
                'merchant_name'           => $payment->merchant_name,
                'email'                   => $payment->email,
                'phone'                   => $payment->phone,
                'bank_label'              => $payment->bank_label,
                'account_number'          => $payment->account_number,
                'proof_url'               => $payment->proof_url,
                'accountant_comment'      => $payment->accountant_comment,
                'resolution_status'       => $payment->resolution_status,
                'resolution_status_label' => $payment->resolution_status_label,
                'payment_status'          => $payment->payment_status,
                'payment_status_label'    => $payment->payment_status_label,
                'receiver_name'           => $payment->receiver?->name,
                'resolver_name'           => $payment->resolver?->name,
                'received_at'             => $payment->received_at?->format('d M Y, H:i'),
                'resolved_at'             => $payment->resolved_at?->format('d M Y, H:i'),
                'created_at'              => $payment->created_at->format('d M Y, H:i'),
            ],
            'timeline' => $timeline,
        ]);
    }
}
