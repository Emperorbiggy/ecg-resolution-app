import { Link } from '@inertiajs/react';
import DarkModeToggle from '@/Components/shared/DarkModeToggle';
import OfflineBanner from '@/Components/shared/OfflineBanner';
import InstallPrompt from '@/Components/shared/InstallPrompt';

export default function MerchantLayout({ children, title }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-950 dark:via-blue-950/20 dark:to-slate-950">
            <OfflineBanner />

            {/* Navbar */}
            <nav className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60">
                <div className="mx-auto max-w-2xl px-4 sm:px-6">
                    <div className="flex h-16 items-center justify-between">
                        <Link href="/" className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-brand shadow-brand">
                                <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900 dark:text-white font-display leading-none">OIRS</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-none mt-0.5">Merchant Portal</p>
                            </div>
                        </Link>
                        <DarkModeToggle />
                    </div>
                </div>
            </nav>

            {/* Content */}
            <main className="mx-auto max-w-2xl px-4 sm:px-6 py-8">
                {title && (
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-display mb-6">{title}</h1>
                )}
                {children}
            </main>

            <InstallPrompt />
        </div>
    );
}
