import { Link } from '@inertiajs/react';
import StaffLayout from '@/Layouts/StaffLayout';
import { Card, CardTitle } from '@/Components/ui/Card';
import Badge from '@/Components/ui/Badge';
import Timeline from '@/Components/ui/Timeline';

export default function PaymentDetail({ payment, timeline = [] }) {
    return (
        <StaffLayout header={`Payment: ${payment.ipn}`}>
            <div className="max-w-3xl space-y-5 animate-fade-in">
                <Link href={route('admin.payments')} className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700">
                    ← Back to Payments
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <Card>
                        <CardTitle className="mb-3">Payment Information</CardTitle>
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

                    <Card>
                        <CardTitle className="mb-3">Resolution Details</CardTitle>
                        <div className="space-y-3 text-sm">
                            {payment.receiver_name && (
                                <div>
                                    <p className="text-xs text-slate-400 font-medium">Verified By</p>
                                    <p className="text-slate-900 dark:text-white mt-0.5 font-medium">{payment.receiver_name}</p>
                                    {payment.received_at && <p className="text-xs text-slate-400">{payment.received_at}</p>}
                                </div>
                            )}
                            {payment.resolver_name && (
                                <div>
                                    <p className="text-xs text-slate-400 font-medium">Resolved By</p>
                                    <p className="text-slate-900 dark:text-white mt-0.5 font-medium">{payment.resolver_name}</p>
                                    {payment.resolved_at && <p className="text-xs text-slate-400">{payment.resolved_at}</p>}
                                </div>
                            )}
                            {payment.accountant_comment && (
                                <div>
                                    <p className="text-xs text-slate-400 font-medium">Accountant Note</p>
                                    <p className="text-slate-600 dark:text-slate-400 mt-0.5 italic">"{payment.accountant_comment}"</p>
                                </div>
                            )}
                            <div>
                                <a
                                    href={payment.proof_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-600 dark:text-brand-400 hover:underline"
                                >
                                    View Receipt →
                                </a>
                            </div>
                        </div>
                    </Card>
                </div>

                <Card>
                    <CardTitle className="mb-4">Activity Timeline</CardTitle>
                    <Timeline items={timeline} />
                </Card>
            </div>
        </StaffLayout>
    );
}
