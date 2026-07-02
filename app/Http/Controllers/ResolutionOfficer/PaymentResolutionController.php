<?php

namespace App\Http\Controllers\ResolutionOfficer;

use App\Http\Controllers\Controller;
use App\Models\PaymentResolution;
use App\Notifications\PaymentResolvedNotification;
use App\Services\AuditLogService;
use App\Services\PaymentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use Inertia\Inertia;
use Inertia\Response;

class PaymentResolutionController extends Controller
{
    public function __construct(private readonly PaymentService $paymentService) {}

    public function index(Request $request): Response
    {
        // Main queue — received but NOT yet resolved
        $query = PaymentResolution::where('payment_status', 'received')
                                  ->where('resolution_status', '!=', 'resolved');

        if ($search = $request->get('search')) {
            $query->where(fn ($q) => $q
                ->where('ipn', 'like', "%{$search}%")
                ->orWhere('merchant_name', 'like', "%{$search}%")
            );
        }

        $payments = $query->latest()->paginate(15)->through(fn ($p) => [
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

        return Inertia::render('ResolutionOfficer/PaymentList', [
            'payments'        => $payments,
            'filters'         => $request->only('search'),
            'resolved_count'  => PaymentResolution::where('resolution_status', 'resolved')->count(),
        ]);
    }

    public function resolved(Request $request): Response
    {
        $query = PaymentResolution::where('resolution_status', 'resolved');

        if ($search = $request->get('search')) {
            $query->where(fn ($q) => $q
                ->where('ipn', 'like', "%{$search}%")
                ->orWhere('merchant_name', 'like', "%{$search}%")
            );
        }

        $payments = $query->latest()->paginate(15)->through(fn ($p) => [
            'id'                      => $p->id,
            'ipn'                     => $p->ipn,
            'merchant_name'           => $p->merchant_name,
            'bank_label'              => $p->bank_label,
            'created_at'              => $p->created_at->format('d M Y'),
            'resolution_status'       => $p->resolution_status,
            'resolution_status_label' => $p->resolution_status_label,
            'payment_status'          => $p->payment_status,
            'payment_status_label'    => $p->payment_status_label,
            'resolved_at'             => $p->resolved_at?->format('d M Y, H:i'),
        ]);

        return Inertia::render('ResolutionOfficer/ResolvedPayments', [
            'payments' => $payments,
            'filters'  => $request->only('search'),
        ]);
    }

    public function show(PaymentResolution $payment): Response
    {
        $timeline = AuditLogService::getTimeline($payment->ipn);

        return Inertia::render('ResolutionOfficer/PaymentResolve', [
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
                'created_at'              => $payment->created_at->format('d M Y, H:i'),
            ],
            'timeline' => $timeline,
        ]);
    }

    public function resolve(Request $request, PaymentResolution $payment)
    {
        abort_if($payment->resolution_status === 'resolved', 422, 'Payment is already resolved.');

        $this->paymentService->resolve($payment, $request);

        // Send email notification to merchant
        Notification::route('mail', $payment->email)
            ->notify(new PaymentResolvedNotification($payment->fresh()));

        AuditLogService::log([
            'action'      => 'resolution_email_sent',
            'entity_type' => 'payment_resolution',
            'entity_id'   => $payment->id,
            'ipn'         => $payment->ipn,
            'description' => "Resolution email sent to {$payment->email} for IPN {$payment->ipn}",
        ], $request);

        return redirect()->route('resolution.payments')
            ->with('success', 'Payment resolved successfully. An email has been sent to the merchant.');
    }
}
