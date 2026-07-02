<?php

namespace App\Http\Controllers\Accountant;

use App\Http\Controllers\Controller;
use App\Http\Requests\Accountant\ReviewPaymentRequest;
use App\Models\PaymentResolution;
use App\Services\AuditLogService;
use App\Services\PaymentService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaymentReviewController extends Controller
{
    public function __construct(private readonly PaymentService $paymentService) {}

    public function index(Request $request): Response
    {
        // Main queue — exclude already-received payments
        $query = PaymentResolution::whereIn('payment_status', ['pending']);

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

        return Inertia::render('Accountant/PaymentList', [
            'payments'       => $payments,
            'filters'        => $request->only('search'),
            'received_count' => PaymentResolution::where('payment_status', 'received')->count(),
        ]);
    }

    public function received(Request $request): Response
    {
        $query = PaymentResolution::where('payment_status', 'received');

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
            'received_at'             => $p->received_at?->format('d M Y, H:i'),
        ]);

        return Inertia::render('Accountant/ReceivedPayments', [
            'payments' => $payments,
            'filters'  => $request->only('search'),
        ]);
    }

    public function show(PaymentResolution $payment): Response
    {
        $timeline = AuditLogService::getTimeline($payment->ipn);

        return Inertia::render('Accountant/PaymentReview', [
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

    public function review(ReviewPaymentRequest $request, PaymentResolution $payment)
    {
        $verdict = $request->validated('verdict');
        $comment = $request->validated('comment');

        match ($verdict) {
            'received' => $this->paymentService->markReceived($payment, $comment, $request),
            'pending'  => $this->paymentService->markPending($payment, $comment, $request),
            'other'    => $this->paymentService->markOther($payment, $comment, $request),
        };

        return redirect()->route('accountant.payments')
            ->with('success', 'Payment review submitted successfully.');
    }
}
