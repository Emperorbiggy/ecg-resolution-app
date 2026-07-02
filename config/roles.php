<?php

return [
    'super_admin'        => 'super_admin',
    'accountant'         => 'accountant',
    'resolution_officer' => 'resolution_officer',

    'labels' => [
        'super_admin'        => 'Super Admin',
        'accountant'         => 'Accountant',
        'resolution_officer' => 'Payment Resolution Officer',
        'merchant'           => 'Merchant',
    ],

    'banks' => [
        'wema_bank'        => 'Wema Bank',
        'alpha_morgan_bank' => 'Alpha Morgan Bank',
    ],

    'resolution_statuses' => [
        'open'      => 'Open',
        'reviewing' => 'Reviewing',
        'resolved'  => 'Resolved',
    ],

    'payment_statuses' => [
        'pending'  => 'Pending',
        'received' => 'Received',
        'paid'     => 'Paid',
    ],

    'audit_actions' => [
        'ipn_resolution_submitted' => 'IPN Resolution Submitted',
        'payment_verified'         => 'Payment Verified',
        'payment_marked_pending'   => 'Payment Marked Pending',
        'payment_review_updated'   => 'Payment Review Updated',
        'payment_resolved'         => 'Payment Resolved',
        'resolution_email_sent'    => 'Resolution Email Sent',
        'user_logged_in'           => 'User Logged In',
        'user_logged_out'          => 'User Logged Out',
        'login_failed'             => 'Login Failed',
        'user_created'             => 'User Created',
        'user_updated'             => 'User Updated',
        'user_deleted'             => 'User Deleted',
        'user_activated'           => 'User Activated',
        'user_deactivated'         => 'User Deactivated',
        'password_reset'           => 'Password Reset',
    ],
];
