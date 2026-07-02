import { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import MerchantLayout from '@/Layouts/MerchantLayout';
import { useMerchantStorage } from '@/hooks/useMerchantStorage';
import { useToast } from '@/Components/ui/Toast';
import Button from '@/Components/ui/Button';
import { SelectField } from '@/Components/ui/InputField';
import FileUpload from '@/Components/ui/FileUpload';
import ConfirmDialog from '@/Components/ui/ConfirmDialog';
import Modal from '@/Components/ui/Modal';
import { Link } from '@inertiajs/react';

// ── Input sanitisers ────────────────────────────────────────────────────────

const digitsOnly  = (v) => v.replace(/\D/g, '');
const sanitiseText = (v) =>
    v.replace(/\0/g, '')
     .replace(/<[^>]*>/g, '')
     .replace(/[<>"'`]/g, '')
     .replace(/\s+/, ' ');

// ── Counter badge ────────────────────────────────────────────────────────────

function Counter({ value, max, exact = false }) {
    const len  = value.length;
    const good = exact ? len === max : len > 0 && len <= max;
    const over = len > max;
    return (
        <span className={`text-xs tabular-nums font-medium ${good ? 'text-emerald-500' : over ? 'text-red-500' : 'text-slate-400'}`}>
            {len}/{max}
        </span>
    );
}

// ── Reusable labelled field wrapper ─────────────────────────────────────────

function Field({ label, required, hint, error, right, children }) {
    return (
        <div className="space-y-1">
            <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    {label}{required && <span className="text-red-500 ml-0.5">*</span>}
                </label>
                {right}
            </div>
            {children}
            {error && <p className="text-xs text-red-500">{error}</p>}
            {hint && !error && <p className="text-xs text-slate-400 dark:text-slate-500">{hint}</p>}
        </div>
    );
}

// ── Main component ───────────────────────────────────────────────────────────

export default function Submit() {
    const { merchant, save } = useMerchantStorage();
    const toast = useToast();

    const [showSaveDialog,   setShowSaveDialog]   = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [pendingSave,      setPendingSave]      = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        ipn:              '',
        transaction_date: '',
        merchant_name:    merchant?.name  || '',
        email:            merchant?.email || '',
        phone:            '',
        bank:             '',
        account_number:   '',
        proof_of_payment: null,
    });

    useEffect(() => {
        if (merchant) {
            setData((prev) => ({
                ...prev,
                merchant_name: prev.merchant_name || merchant.name  || '',
                email:         prev.email         || merchant.email || '',
            }));
        }
    }, [merchant]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('merchant.payments.store'), {
            forceFormData: true,
            onSuccess: (page) => {
                setPendingSave({ name: data.merchant_name, email: data.email });
                setShowSuccessModal(true);
                reset();
            },
            onError: () => toast.error('Please fix the errors below and try again.'),
        });
    };

    const handleSaveYes = () => {
        save(pendingSave);
        setShowSaveDialog(false);
        toast.success('Your details have been saved for future submissions.');
    };

    const handleSuccessClose = () => {
        setShowSuccessModal(false);
        if (!merchant) setShowSaveDialog(true);
    };

    return (
        <MerchantLayout title="Submit Payment for Review">
            <div className="animate-slide-up space-y-5">

                {/* Back link */}
                <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    Back to Home
                </Link>

                {/* Single form card */}
                <form onSubmit={handleSubmit} className="card p-6 space-y-6" noValidate>

                    {/* ── Section: Payment Info ──────────────────────── */}
                    <div>
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400 mb-4">
                            Payment Information
                        </h2>
                        <div className="space-y-4">

                            <Field
                                label="IPN Number"
                                required
                                error={errors.ipn}
                                right={<Counter value={data.ipn} max={12} />}
                            >
                                <input
                                    inputMode="numeric"
                                    pattern="\d*"
                                    maxLength={12}
                                    placeholder="Enter IPN number (up to 12 digits)"
                                    value={data.ipn}
                                    onChange={(e) => setData('ipn', digitsOnly(e.target.value))}
                                    className="input-field w-full"
                                />
                            </Field>

                            <Field label="Transaction Date" required error={errors.transaction_date}>
                                <input
                                    type="date"
                                    max={new Date().toISOString().split('T')[0]}
                                    value={data.transaction_date}
                                    onChange={(e) => setData('transaction_date', e.target.value)}
                                    className="input-field w-full"
                                />
                            </Field>

                        </div>
                    </div>

                    <hr className="border-slate-100 dark:border-slate-700" />

                    {/* ── Section: Personal Details ──────────────────── */}
                    <div>
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400 mb-4">
                            Your Details
                        </h2>
                        <div className="space-y-4">

                            <Field label="Full Name" required error={errors.merchant_name}>
                                <input
                                    type="text"
                                    placeholder="Enter your full name"
                                    maxLength={100}
                                    autoComplete="name"
                                    value={data.merchant_name}
                                    onChange={(e) => setData('merchant_name', sanitiseText(e.target.value))}
                                    className="input-field w-full"
                                />
                            </Field>

                            <Field label="Email Address" required error={errors.email}>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    autoComplete="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value.trim())}
                                    className="input-field w-full"
                                />
                            </Field>

                            <Field label="Phone Number" required error={errors.phone}>
                                <input
                                    inputMode="numeric"
                                    pattern="\d*"
                                    maxLength={15}
                                    placeholder="e.g. 08012345678"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', digitsOnly(e.target.value))}
                                    className="input-field w-full"
                                />
                            </Field>

                        </div>
                    </div>

                    <hr className="border-slate-100 dark:border-slate-700" />

                    {/* ── Section: Bank & Receipt ────────────────────── */}
                    <div>
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400 mb-4">
                            Bank Details & Proof of Payment
                        </h2>
                        <div className="space-y-4">

                            <SelectField
                                label="Bank"
                                required
                                value={data.bank}
                                onChange={(e) => setData('bank', e.target.value)}
                                error={errors.bank}
                            >
                                <option value="">Select your bank</option>
                                <option value="wema_bank">Wema Bank</option>
                                <option value="alpha_morgan_bank">Alpha Morgan Bank</option>
                            </SelectField>

                            <Field
                                label="Account Number"
                                required
                                error={errors.account_number}
                                right={<Counter value={data.account_number} max={10} exact />}
                            >
                                <input
                                    inputMode="numeric"
                                    pattern="\d{10}"
                                    maxLength={10}
                                    placeholder="Enter 10-digit account number"
                                    value={data.account_number}
                                    onChange={(e) => setData('account_number', digitsOnly(e.target.value))}
                                    className="input-field w-full"
                                />
                            </Field>

                            <Field
                                label="Proof of Payment"
                                required
                                error={errors.proof_of_payment}
                                hint="JPG, PNG or PDF · Max 5 MB · File is scanned on upload."
                            >
                                <FileUpload
                                    onChange={(file) => setData('proof_of_payment', file)}
                                    error={errors.proof_of_payment}
                                />
                            </Field>

                        </div>
                    </div>

                    {/* Submit */}
                    <Button
                        type="submit"
                        variant="primary"
                        className="w-full py-4 text-base"
                        loading={processing}
                        disabled={processing}
                    >
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Submit Payment for Review
                    </Button>

                </form>
            </div>

            {/* Success modal */}
            <Modal show={showSuccessModal} onClose={handleSuccessClose} title="Payment Submitted!" size="sm">
                <div className="text-center space-y-4">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                        <svg className="h-8 w-8 text-emerald-600 dark:text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-semibold text-slate-900 dark:text-white">Successfully Submitted!</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Your payment has been submitted for review. You will be notified once it is resolved.
                        </p>
                    </div>
                    <Button variant="primary" className="w-full" onClick={handleSuccessClose}>Done</Button>
                </div>
            </Modal>

            {/* Save details dialog */}
            <ConfirmDialog
                show={showSaveDialog}
                onClose={() => setShowSaveDialog(false)}
                onConfirm={handleSaveYes}
                title="Save Your Details?"
                confirmLabel="Yes, Save"
                cancelLabel="No Thanks"
                message="Would you like to save your name and email for faster submissions next time?"
            />
        </MerchantLayout>
    );
}
