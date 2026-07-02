import { useState } from 'react';
import { useForm, Link } from '@inertiajs/react';
import StaffLayout from '@/Layouts/StaffLayout';
import { Card, CardTitle } from '@/Components/ui/Card';
import Badge from '@/Components/ui/Badge';
import Timeline from '@/Components/ui/Timeline';
import Button from '@/Components/ui/Button';
import ConfirmDialog from '@/Components/ui/ConfirmDialog';
import Modal from '@/Components/ui/Modal';
import { useToast } from '@/Components/ui/Toast';

export default function PaymentResolve({ payment, timeline = [] }) {
    const [showConfirm, setShowConfirm] = useState(false);
    const [showSuccess, setShowSuccess]  = useState(false);
    const toast = useToast();

    const { put, processing } = useForm();

    const alreadyResolved = payment.resolution_status === 'resolved';

    const handleResolve = () => {
        put(route('resolution.payments.resolve', payment.id), {
            onSuccess: () => {
                setShowConfirm(false);
                setShowSuccess(true);
            },
            onError: () => {
                setShowConfirm(false);
                toast.error('Failed to resolve payment. Please try again.');
            },
        });
    };

    return (
        <StaffLayout header={`Resolve: ${payment.ipn}`}>
            <div className="max-w-3xl space-y-5 animate-fade-in">
                <Link
                    href={route('resolution.payments')}
                    className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700"
                >
                    ← Back to Payments
                </Link>

                {alreadyResolved && (
                    <div className="rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-4 flex gap-3">
                        <svg className="h-5 w-5 text-emerald-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm text-emerald-800 dark:text-emerald-300 font-medium">
                            This payment has already been resolved.
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2 space-y-4">
                        {/* Receipt */}
                        <Card>
                            <CardTitle className="mb-3">Proof of Payment</CardTitle>
                            <a href={payment.proof_url} target="_blank" rel="noopener noreferrer"
                                className="group flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700 p-3 hover:border-brand-400 transition-colors">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 dark:bg-red-900/20">
                                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">View Receipt</p>
                                </div>
                                <svg className="h-4 w-4 text-slate-400 group-hover:text-brand-500 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                </svg>
                            </a>
                        </Card>

                        {/* Details */}
                        <Card>
                            <CardTitle className="mb-3">Payment Details</CardTitle>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                {[
                                    ['IPN',              payment.ipn],
                                    ['Transaction Date', payment.transaction_date],
                                    ['Merchant Name',    payment.merchant_name],
                                    ['Email',            payment.email],
                                    ['Phone',            payment.phone],
                                    ['Bank',             payment.bank_label],
                                    ['Account Number',   payment.account_number],
                                    ['Submitted',        payment.created_at],
                                ].map(([k, v]) => (
                                    <div key={k}>
                                        <p className="text-xs text-slate-400 font-medium">{k}</p>
                                        <p className="text-slate-900 dark:text-white mt-0.5 font-medium break-all">{v}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 flex flex-wrap gap-2">
                                <Badge status={payment.resolution_status} label={payment.resolution_status_label} />
                                <Badge status={payment.payment_status}    label={payment.payment_status_label} />
                            </div>
                        </Card>

                        {/* Accountant comment */}
                        {payment.accountant_comment && (
                            <Card>
                                <CardTitle className="mb-2">Accountant Note</CardTitle>
                                <p className="text-sm text-slate-600 dark:text-slate-400 italic">"{payment.accountant_comment}"</p>
                            </Card>
                        )}

                        {/* Timeline */}
                        <Card>
                            <CardTitle className="mb-4">Activity Timeline</CardTitle>
                            <Timeline items={timeline} />
                        </Card>
                    </div>

                    {/* Right: resolve action */}
                    <div>
                        <Card>
                            <CardTitle className="mb-3">Resolution Action</CardTitle>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                                Manually resolve this payment on the OIRS platform before clicking the button below.
                            </p>
                            <Button
                                variant={alreadyResolved ? 'secondary' : 'primary'}
                                className="w-full"
                                disabled={alreadyResolved}
                                onClick={() => setShowConfirm(true)}
                            >
                                {alreadyResolved ? '✓ Already Resolved' : 'Resolve Payment'}
                            </Button>
                        </Card>
                    </div>
                </div>
            </div>

            <ConfirmDialog
                show={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={handleResolve}
                loading={processing}
                title="Confirm Payment Resolution"
                message={`You are marking IPN ${payment.ipn} as resolved and paid. An email will be sent to ${payment.email}. Proceed?`}
                confirmLabel="Yes, Resolve"
            />

            {/* Success modal */}
            <Modal show={showSuccess} onClose={() => setShowSuccess(false)} size="sm" title="Payment Resolved!">
                <div className="text-center space-y-4">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                        <svg className="h-8 w-8 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-semibold text-slate-900 dark:text-white">Payment Resolved!</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            A confirmation email has been sent to {payment.email}.
                        </p>
                    </div>
                    <Button variant="primary" className="w-full" onClick={() => {
                        setShowSuccess(false);
                        window.location.href = route('resolution.payments');
                    }}>
                        Back to Payments
                    </Button>
                </div>
            </Modal>
        </StaffLayout>
    );
}
