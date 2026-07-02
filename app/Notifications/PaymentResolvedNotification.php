<?php

namespace App\Notifications;

use App\Models\PaymentResolution;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PaymentResolvedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public readonly PaymentResolution $payment) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('IPN Payment Successfully Resolved')
            ->greeting("Hello {$this->payment->merchant_name},")
            ->line("Your IPN payment submitted on {$this->payment->created_at->format('d M Y')} has been successfully resolved.")
            ->line("**IPN:** {$this->payment->ipn}")
            ->line("**Status:** Resolved")
            ->line("**Transaction Date:** {$this->payment->transaction_date->format('d M Y')}")
            ->line('Thank you for using the OIRS Merchant Portal.')
            ->salutation('OIRS Merchant Portal');
    }
}
