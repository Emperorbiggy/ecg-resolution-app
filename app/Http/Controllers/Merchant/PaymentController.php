<?php

namespace App\Http\Controllers\Merchant;

use App\Http\Controllers\Controller;
use App\Http\Requests\Merchant\SubmitPaymentRequest;
use App\Models\PaymentResolution;
use App\Services\AuditLogService;
use App\Services\PaymentService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    public function __construct(private readonly PaymentService $paymentService) {}

    public function welcome(): Response
    {
        return Inertia::render('Merchant/Welcome');
    }

    public function store(SubmitPaymentRequest $request)
    {
        $payment = $this->paymentService->submit($request->validated(), $request);

        return redirect()->back()->with([
            'success'    => true,
            'payment_id' => $payment->id,
            'message'    => 'Your payment has been submitted successfully.',
        ]);
    }

    public function index(Request $request)
    {
        $email = $request->query('email');

        if (! $email) {
            return redirect()->route('merchant.welcome');
        }

        $payments = PaymentResolution::where('email', $email)
            ->latest()
            ->get()
            ->map(fn ($p) => [
                'id'               => $p->id,
                'ipn'              => $p->ipn,
                'transaction_date' => $p->transaction_date->format('d M Y'),
                'created_at'       => $p->created_at->format('d M Y'),
                'resolution_status' => $p->resolution_status,
                'resolution_status_label' => $p->resolution_status_label,
                'payment_status'   => $p->payment_status,
                'payment_status_label' => $p->payment_status_label,
            ]);

        return Inertia::render('Merchant/PaymentList', [
            'payments' => $payments,
            'email'    => $email,
        ]);
    }

    public function status(Request $request): Response
    {
        $ipn     = trim(preg_replace('/\D/', '', $request->query('ipn', '')));
        $payment = null;
        $timeline = collect();

        if ($ipn !== '') {
            $payment = PaymentResolution::where('ipn', $ipn)->latest()->first();

            if ($payment) {
                $timeline = AuditLogService::getTimeline($ipn);
                $payment  = [
                    'ipn'                     => $payment->ipn,
                    'transaction_date'        => $payment->transaction_date->format('d M Y'),
                    'bank_label'              => $payment->bank_label,
                    'resolution_status'       => $payment->resolution_status,
                    'resolution_status_label' => $payment->resolution_status_label,
                    'payment_status'          => $payment->payment_status,
                    'payment_status_label'    => $payment->payment_status_label,
                    'accountant_comment'      => $payment->accountant_comment,
                    'submitted_at'            => $payment->created_at->format('d M Y, H:i'),
                    'resolved_at'             => $payment->resolved_at?->format('d M Y, H:i'),
                ];
            }
        }

        return Inertia::render('Merchant/Status', [
            'ipn'      => $ipn,
            'payment'  => $payment,
            'timeline' => $timeline,
            'searched' => $ipn !== '',
        ]);
    }


    public function show(PaymentResolution $payment): Response
    {
        $timeline = AuditLogService::getTimeline($payment->ipn);

        return Inertia::render('Merchant/PaymentDetail', [
            'payment'  => [
                'id'               => $payment->id,
                'ipn'              => $payment->ipn,
                'transaction_date' => $payment->transaction_date->format('d M Y'),
                'merchant_name'    => $payment->merchant_name,
                'email'            => $payment->email,
                'phone'            => $payment->phone,
                'bank_label'       => $payment->bank_label,
                'account_number'   => $payment->account_number,
                'proof_url'        => $payment->proof_url,
                'resolution_status' => $payment->resolution_status,
                'resolution_status_label' => $payment->resolution_status_label,
                'payment_status'   => $payment->payment_status,
                'payment_status_label' => $payment->payment_status_label,
                'accountant_comment' => $payment->accountant_comment,
                'created_at'       => $payment->created_at->format('d M Y, H:i'),
            ],
            'timeline' => $timeline,
        ]);
    }
}
