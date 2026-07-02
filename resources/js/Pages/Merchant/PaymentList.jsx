import { Link } from '@inertiajs/react';
import MerchantLayout from '@/Layouts/MerchantLayout';
import Badge from '@/Components/ui/Badge';
import EmptyState from '@/Components/ui/EmptyState';
import Button from '@/Components/ui/Button';

export default function PaymentList({ payments = [], email }) {
    return (
        <MerchantLayout title="My Submitted Payments">
            <div className="space-y-4 animate-slide-up">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Showing payments for</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{email}</p>
                    </div>
                    <Link href="/submit" className="btn-primary py-2 px-4 text-sm rounded-xl">
                        + New Submission
                    </Link>
                </div>

                {payments.length === 0 ? (
                    <div className="card">
                        <EmptyState
                            title="No payments found"
                            description="You haven't submitted any payments with this email address."
                            action={
                                <Link href="/submit" className="btn-primary">
                                    Submit Your First Payment
                                </Link>
                            }
                        />
                    </div>
                ) : (
                    <div className="space-y-3">
                        {payments.map((payment) => (
                            <Link
                                key={payment.id}
                                href={route('merchant.payments.show', payment.id)}
                                className="card-hover flex items-center gap-4 p-4"
                            >
                                {/* IPN badge */}
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-900/30">
                                    <svg className="h-5 w-5 text-brand-600 dark:text-brand-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                    </svg>
                                </div>

                                {/* Details */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                                        IPN: {payment.ipn}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        Submitted {payment.created_at}
                                    </p>
                                </div>

                                {/* Statuses */}
                                <div className="flex flex-col gap-1 items-end shrink-0">
                                    <Badge status={payment.resolution_status} label={payment.resolution_status_label} />
                                    <Badge status={payment.payment_status} label={payment.payment_status_label} />
                                </div>

                                <svg className="h-4 w-4 text-slate-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                </svg>
                            </Link>
                        ))}
                    </div>
                )}

                <div className="text-center">
                    <Link href="/" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 underline">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </MerchantLayout>
    );
}
