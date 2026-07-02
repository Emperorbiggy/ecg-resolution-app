import { Link } from '@inertiajs/react';
import MerchantLayout from '@/Layouts/MerchantLayout';
import Badge from '@/Components/ui/Badge';
import Timeline from '@/Components/ui/Timeline';
import { Card } from '@/Components/ui/Card';

function StatusStepper({ resolution, payment }) {
    const steps = [
        { key: 'open',      label: 'Submitted',  done: true },
        { key: 'reviewing', label: 'Under Review', done: ['reviewing', 'resolved'].includes(resolution) },
        { key: 'resolved',  label: 'Resolved',   done: resolution === 'resolved' },
    ];

    return (
        <div className="flex items-center gap-0">
            {steps.map((s, i) => (
                <div key={s.key} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center">
                        <div className={`flex h-7 w-7 items-center justify-center rounded-full transition-all duration-500 text-xs font-semibold
                            ${s.done ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500'}
                        `}>
                            {s.done ? (
                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            ) : i + 1}
                        </div>
                        <span className={`mt-1 text-xs font-medium whitespace-nowrap ${s.done ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`}>
                            {s.label}
                        </span>
                    </div>
                    {i < steps.length - 1 && (
                        <div className={`flex-1 h-px mx-2 mt-[-18px] transition-all duration-500 ${s.done && steps[i+1].done ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`} />
                    )}
                </div>
            ))}
        </div>
    );
}

export default function PaymentDetail({ payment, timeline = [] }) {
    const isPendingMessage = payment.payment_status === 'pending' && payment.resolution_status === 'reviewing';

    return (
        <MerchantLayout title={`IPN: ${payment.ipn}`}>
            <div className="space-y-4 animate-slide-up">
                <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    Back
                </Link>

                {/* Status banner for pending notice */}
                {isPendingMessage && (
                    <div className="rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 flex gap-3">
                        <svg className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                        </svg>
                        <p className="text-sm text-amber-800 dark:text-amber-300">
                            Your payment has not yet been received. Please check again later.
                        </p>
                    </div>
                )}

                {/* Status tracker */}
                <Card>
                    <StatusStepper resolution={payment.resolution_status} payment={payment.payment_status} />
                    <div className="mt-4 flex flex-wrap gap-2">
                        <Badge status={payment.resolution_status} label={payment.resolution_status_label} />
                        <Badge status={payment.payment_status} label={payment.payment_status_label} />
                    </div>
                </Card>

                {/* Receipt */}
                <Card>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Proof of Payment</h3>
                    <a
                        href={payment.proof_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700 p-3 hover:border-brand-400 transition-colors"
                    >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 dark:bg-red-900/20">
                            <svg className="h-5 w-5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                            </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 dark:text-white">View Receipt</p>
                            <p className="text-xs text-slate-400 dark:text-slate-500">Click to open</p>
                        </div>
                        <svg className="h-4 w-4 text-slate-400 group-hover:text-brand-500 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                    </a>
                </Card>

                {/* Payment details */}
                <Card>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Submission Details</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        {[
                            ['IPN',              payment.ipn],
                            ['Transaction Date', payment.transaction_date],
                            ['Full Name',        payment.merchant_name],
                            ['Email',            payment.email],
                            ['Phone',            payment.phone],
                            ['Bank',             payment.bank_label],
                            ['Account Number',   payment.account_number],
                            ['Submitted',        payment.created_at],
                        ].map(([k, v]) => (
                            <div key={k}>
                                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">{k}</p>
                                <p className="text-slate-900 dark:text-white mt-0.5 font-medium break-all">{v}</p>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Accountant comment */}
                {payment.accountant_comment && (
                    <Card>
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Accountant Note</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 italic">"{payment.accountant_comment}"</p>
                    </Card>
                )}

                {/* Activity timeline */}
                <Card>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Activity Timeline</h3>
                    <Timeline items={timeline} />
                </Card>
            </div>
        </MerchantLayout>
    );
}
