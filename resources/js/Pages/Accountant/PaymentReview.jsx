import { useState } from 'react';
import { useForm, Link } from '@inertiajs/react';
import StaffLayout from '@/Layouts/StaffLayout';
import { Card, CardTitle } from '@/Components/ui/Card';
import Badge from '@/Components/ui/Badge';
import Timeline from '@/Components/ui/Timeline';
import Button from '@/Components/ui/Button';
import ConfirmDialog from '@/Components/ui/ConfirmDialog';
import { TextareaField } from '@/Components/ui/InputField';
import { useToast } from '@/Components/ui/Toast';

export default function PaymentReview({ payment, timeline = [] }) {
    const [showConfirm, setShowConfirm] = useState(false);
    const toast = useToast();

    const { data, setData, put, processing } = useForm({
        verdict: '',
        comment: payment.accountant_comment || '',
    });

    const handleConfirm = () => {
        put(route('accountant.payments.review', payment.id), {
            onSuccess: () => {
                toast.success('Payment review submitted successfully.');
                setShowConfirm(false);
            },
            onError: () => toast.error('Please select a verdict.'),
        });
    };

    const verdictOptions = [
        { value: 'received', label: 'Received', desc: 'Payment has been confirmed received', color: 'emerald' },
        { value: 'pending',  label: 'Pending',  desc: 'Payment has not been received yet',  color: 'amber' },
        { value: 'other',    label: 'Other',    desc: 'Add a comment for further review',    color: 'slate' },
    ];

    return (
        <StaffLayout header={`Review: ${payment.ipn}`}>
            <div className="max-w-3xl space-y-5 animate-fade-in">
                <Link
                    href={route('accountant.payments')}
                    className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                >
                    ← Back to Payments
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Left: details */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Receipt */}
                        <Card>
                            <CardTitle className="mb-3">Proof of Payment</CardTitle>
                            <a
                                href={payment.proof_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700 p-3 hover:border-brand-400 transition-colors"
                            >
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 dark:bg-red-900/20">
                                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">View Receipt</p>
                                    <p className="text-xs text-slate-400">Click to open in new tab</p>
                                </div>
                                <svg className="h-4 w-4 text-slate-400 group-hover:text-brand-500 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                </svg>
                            </a>
                        </Card>

                        {/* Merchant details */}
                        <Card>
                            <CardTitle className="mb-3">Merchant & Payment Details</CardTitle>
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
                                        <p className="text-xs text-slate-400 font-medium">{k}</p>
                                        <p className="text-slate-900 dark:text-white mt-0.5 font-medium break-all">{v}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 flex gap-2">
                                <Badge status={payment.resolution_status} label={payment.resolution_status_label} />
                                <Badge status={payment.payment_status}    label={payment.payment_status_label} />
                            </div>
                        </Card>

                        {/* Timeline */}
                        <Card>
                            <CardTitle className="mb-4">Activity Timeline</CardTitle>
                            <Timeline items={timeline} />
                        </Card>
                    </div>

                    {/* Right: review form */}
                    <div className="space-y-4">
                        <Card>
                            <CardTitle className="mb-4">Accountant Verification</CardTitle>

                            <div className="space-y-3">
                                {verdictOptions.map((opt) => (
                                    <label
                                        key={opt.value}
                                        className={`flex items-start gap-3 cursor-pointer rounded-xl border-2 p-3 transition-all duration-200
                                            ${data.verdict === opt.value
                                                ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
                                                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            value={opt.value}
                                            checked={data.verdict === opt.value}
                                            onChange={(e) => setData('verdict', e.target.value)}
                                            className="mt-0.5 text-brand-500"
                                        />
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{opt.label}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">{opt.desc}</p>
                                        </div>
                                    </label>
                                ))}
                            </div>

                            {(data.verdict === 'other' || data.verdict === 'pending') && (
                                <div className="mt-4 animate-slide-down">
                                    <TextareaField
                                        label="Comment"
                                        placeholder="Add a note for the merchant or resolution officer..."
                                        value={data.comment}
                                        onChange={(e) => setData('comment', e.target.value)}
                                        rows={3}
                                    />
                                </div>
                            )}

                            <Button
                                variant="primary"
                                className="w-full mt-4"
                                disabled={!data.verdict}
                                onClick={() => setShowConfirm(true)}
                            >
                                Submit Review
                            </Button>
                        </Card>
                    </div>
                </div>
            </div>

            <ConfirmDialog
                show={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={handleConfirm}
                loading={processing}
                title="Confirm Review Submission"
                message={`You are marking IPN ${payment.ipn} as "${data.verdict}". This action will update the payment status. Are you sure?`}
                confirmLabel="Yes, Submit"
            />
        </StaffLayout>
    );
}
