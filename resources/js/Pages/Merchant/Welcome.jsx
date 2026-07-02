import { useState, useEffect } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import MerchantLayout from '@/Layouts/MerchantLayout';
import { useMerchantStorage } from '@/hooks/useMerchantStorage';
import Button from '@/Components/ui/Button';
import { useToast } from '@/Components/ui/Toast';

export default function Welcome() {
    const { merchant, clear } = useMerchantStorage();
    const [dismissed, setDismissed] = useState(false);
    const showReturning = !dismissed && !!merchant;
    const toast = useToast();
    const { flash } = usePage().props;

    useEffect(() => {
        if (flash?.success) toast.success(flash.message || 'Done!');
    }, [flash]);

    const handleContinue = () => setDismissed(true);
    const handleSwitch   = () => { clear(); setDismissed(false); };

    return (
        <MerchantLayout>
            <div className="flex flex-col items-center min-h-[calc(100vh-9rem)] justify-center py-8 space-y-6 animate-fade-in">

                {/* Hero card */}
                <div className="w-full rounded-3xl bg-gradient-hero p-8 text-white relative overflow-hidden">
                    {/* Decorative circles */}
                    <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/5" />
                    <div className="absolute -left-4 bottom-0 h-24 w-24 rounded-full bg-white/5" />

                    <div className="relative">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
                            <svg className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 01-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold font-display mb-2">
                            Merchant Payment Portal
                        </h1>
                        <p className="text-blue-200 text-sm leading-relaxed">
                            Submit your IPN payment receipts for verification and track resolution status in real time.
                        </p>
                        <div className="mt-4 flex items-center gap-2 text-xs text-blue-300">
                            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                                <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08z" clipRule="evenodd" />
                            </svg>
                            Secure · Official OIRS Platform
                        </div>
                    </div>
                </div>

                {/* Returning merchant card */}
                {showReturning && merchant && (
                    <div className="w-full glass rounded-2xl p-6 animate-slide-up">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-brand text-white font-bold text-sm">
                                {(merchant.name || merchant.email || 'M')[0].toUpperCase()}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                    Welcome back, {merchant.name || merchant.email}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Continue as {merchant.name || merchant.email}?</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="primary" className="flex-1 text-sm" onClick={handleContinue}>
                                Continue
                            </Button>
                            <Button variant="secondary" className="flex-1 text-sm" onClick={handleSwitch}>
                                Use another account
                            </Button>
                        </div>
                    </div>
                )}

                {/* Action buttons — hidden while returning card is shown */}
                {!showReturning && (
                    <div className="w-full space-y-3 animate-fade-in">
                        <Link href="/submit" className="btn-primary w-full justify-center py-4 text-base rounded-2xl">
                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Submit Payment for Review
                        </Link>

                        {merchant && (
                            <Link
                                href={`${route('merchant.payments.index')}?email=${encodeURIComponent(merchant.email)}`}
                                className="btn-secondary w-full justify-center py-4 text-base rounded-2xl"
                            >
                                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                </svg>
                                Check Previous Submitted Payments
                            </Link>
                        )}
                    </div>
                )}

                {/* Footer note */}
                <p className="text-xs text-center text-slate-400 dark:text-slate-500">
                    Osun State Internal Revenue Service · Official Platform
                </p>
            </div>
        </MerchantLayout>
    );
}
