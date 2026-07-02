import { useState } from 'react';
import { router, Link } from '@inertiajs/react';
import MerchantLayout from '@/Layouts/MerchantLayout';
import Badge from '@/Components/ui/Badge';

const digitsOnly = (v) => v.replace(/\D/g, '');

function InfoRow({ label, value }) {
    if (!value) return null;
    return (
        <div className="flex justify-between items-start gap-4 py-3 border-b border-slate-100 dark:border-slate-700/50 last:border-0">
            <span className="text-sm text-slate-500 dark:text-slate-400 shrink-0">{label}</span>
            <span className="text-sm font-medium text-slate-900 dark:text-white text-right">{value}</span>
        </div>
    );
}

function StatusIcon({ status }) {
    if (status === 'resolved') return (
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
            <svg className="h-8 w-8 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </div>
    );
    if (status === 'reviewing') return (
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
            <svg className="h-8 w-8 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </div>
    );
    return (
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
            <svg className="h-8 w-8 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
        </div>
    );
}

export default function Status({ ipn: initialIpn = '', payment = null, searched = false }) {
    const [ipn, setIpn] = useState(initialIpn);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!ipn.trim()) return;
        router.get(route('merchant.status'), { ipn }, { preserveState: false });
    };

    return (
        <MerchantLayout title="IPN Status Check">
            <div className="animate-fade-in space-y-6">

                {/* Back */}
                <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    Back to Home
                </Link>

                {/* Search card */}
                <div className="card p-6 space-y-4">
                    <div>
                        <h1 className="text-lg font-bold text-slate-900 dark:text-white">IPN Status Check</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Enter your IPN number to check the current status of your payment.
                        </p>
                    </div>

                    <form onSubmit={handleSearch} className="flex gap-2">
                        <input
                            inputMode="numeric"
                            pattern="\d*"
                            maxLength={12}
                            placeholder="Enter IPN number..."
                            value={ipn}
                            onChange={(e) => setIpn(digitsOnly(e.target.value))}
                            className="input-field flex-1"
                            autoFocus
                        />
                        <button
                            type="submit"
                            disabled={!ipn.trim()}
                            className="btn-primary px-5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                            Check
                        </button>
                    </form>
                </div>

                {/* Not found */}
                {searched && !payment && (
                    <div className="card p-8 text-center space-y-3 animate-scale-in">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700">
                            <svg className="h-7 w-7 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                            </svg>
                        </div>
                        <p className="font-semibold text-slate-900 dark:text-white">IPN Not Found</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            No payment record was found for IPN <span className="font-mono font-semibold text-brand-600 dark:text-brand-400">{initialIpn}</span>.
                            Please check the number and try again.
                        </p>
                    </div>
                )}

                {/* Result */}
                {payment && (
                    <div className="space-y-4 animate-slide-up">

                        {/* Status hero */}
                        <div className="card p-6 text-center space-y-3">
                            <StatusIcon status={payment.resolution_status} />

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                                    IPN {payment.ipn}
                                </p>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                    {payment.resolution_status === 'resolved'
                                        ? 'Payment Resolved'
                                        : payment.resolution_status === 'reviewing'
                                        ? 'Under Review'
                                        : 'Awaiting Verification'}
                                </h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                    {payment.resolution_status === 'resolved'
                                        ? 'Your IPN payment has been successfully resolved.'
                                        : payment.resolution_status === 'reviewing'
                                        ? 'Your payment receipt has been received and is being processed.'
                                        : 'Your submission is pending verification.'}
                                </p>
                            </div>

                            <div className="flex justify-center gap-2 flex-wrap">
                                <Badge status={payment.payment_status} />
                                <Badge status={payment.resolution_status} />
                            </div>
                        </div>

                        {/* Details */}
                        <div className="card p-6">
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Payment Details</h3>
                            <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                <InfoRow label="IPN Number"        value={payment.ipn} />
                                <InfoRow label="Bank"              value={payment.bank_label} />
                                <InfoRow label="Transaction Date"  value={payment.transaction_date} />
                                <InfoRow label="Submitted"         value={payment.submitted_at} />
                                {payment.resolved_at && (
                                    <InfoRow label="Resolved On"   value={payment.resolved_at} />
                                )}
                                {payment.accountant_comment && (
                                    <InfoRow label="Remark"        value={payment.accountant_comment} />
                                )}
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </MerchantLayout>
    );
}
