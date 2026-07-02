<?php

namespace App\Services;

use App\Models\Merchant;
use App\Models\PaymentResolution;
use Illuminate\Http\Request;

class PaymentService
{
    public function __construct(
        private readonly FileUploadService $fileUploadService,
        private readonly AuditLogService $auditLogService,
    ) {}

    public function submit(array $data, Request $request): PaymentResolution
    {
        $merchant = Merchant::firstOrCreate(
            ['email' => $data['email']],
            ['name'  => $data['merchant_name']],
        );

        $path = $this->fileUploadService->storeReceipt($data['proof_of_payment']);

        $payment = PaymentResolution::create([
            'merchant_id'       => $merchant?->id,
            'ipn'               => $data['ipn'],
            'transaction_date'  => $data['transaction_date'],
            'merchant_name'     => $data['merchant_name'],
            'email'             => $data['email'],
            'phone'             => $data['phone'],
            'bank'              => $data['bank'],
            'account_number'    => $data['account_number'],
            'proof_of_payment'  => $path,
            'resolution_status' => 'open',
            'payment_status'    => 'pending',
        ]);

        AuditLogService::log([
            'user_id'     => null,
            'user_name'   => $data['merchant_name'],
            'user_email'  => $data['email'],
            'user_role'   => 'merchant',
            'action'      => 'ipn_resolution_submitted',
            'entity_type' => 'payment_resolution',
            'entity_id'   => $payment->id,
            'ipn'         => $payment->ipn,
            'description' => "IPN Resolution submitted by {$data['merchant_name']} for IPN {$payment->ipn}",
        ], $request);

        return $payment;
    }

    public function markReceived(PaymentResolution $payment, string $comment = null, Request $request = null): void
    {
        $user = auth()->user();

        $payment->update([
            'payment_status'    => 'received',
            'resolution_status' => 'reviewing',
            'accountant_comment' => $comment,
            'received_by'       => $user->id,
            'received_at'       => now(),
        ]);

        AuditLogService::log([
            'action'      => 'payment_verified',
            'entity_type' => 'payment_resolution',
            'entity_id'   => $payment->id,
            'ipn'         => $payment->ipn,
            'description' => "Payment verified by {$user->email} for IPN {$payment->ipn}",
        ], $request);
    }

    public function markPending(PaymentResolution $payment, string $comment = null, Request $request = null): void
    {
        $user = auth()->user();

        $payment->update([
            'payment_status'     => 'pending',
            'accountant_comment' => $comment,
        ]);

        AuditLogService::log([
            'action'      => 'payment_marked_pending',
            'entity_type' => 'payment_resolution',
            'entity_id'   => $payment->id,
            'ipn'         => $payment->ipn,
            'description' => "Payment marked pending by {$user->email} for IPN {$payment->ipn}",
        ], $request);
    }

    public function markOther(PaymentResolution $payment, string $comment, Request $request = null): void
    {
        $user = auth()->user();

        $payment->update(['accountant_comment' => $comment]);

        AuditLogService::log([
            'action'      => 'payment_review_updated',
            'entity_type' => 'payment_resolution',
            'entity_id'   => $payment->id,
            'ipn'         => $payment->ipn,
            'description' => "Payment review updated by {$user->email} for IPN {$payment->ipn}",
        ], $request);
    }

    public function resolve(PaymentResolution $payment, Request $request = null): void
    {
        $user = auth()->user();

        $payment->update([
            'resolution_status' => 'resolved',
            'payment_status'    => 'paid',
            'resolved_by'       => $user->id,
            'resolved_at'       => now(),
        ]);

        AuditLogService::log([
            'action'      => 'payment_resolved',
            'entity_type' => 'payment_resolution',
            'entity_id'   => $payment->id,
            'ipn'         => $payment->ipn,
            'description' => "Payment resolved by {$user->email} for IPN {$payment->ipn}",
        ], $request);
    }
}
