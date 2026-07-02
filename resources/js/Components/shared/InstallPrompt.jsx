import { useState } from 'react';
import { useInstallPrompt } from '@/hooks/useInstallPrompt';

export default function InstallPrompt() {
    const { canInstall, install } = useInstallPrompt();
    const [dismissed, setDismissed] = useState(
        () => sessionStorage.getItem('oirs_install_dismissed') === 'true'
    );

    if (!canInstall || dismissed) return null;

    const dismiss = () => {
        sessionStorage.setItem('oirs_install_dismissed', 'true');
        setDismissed(true);
    };

    return (
        <div className="glass fixed bottom-4 left-4 right-4 z-40 rounded-2xl p-4 shadow-glass-lg animate-slide-up md:left-auto md:right-6 md:w-80">
            <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-brand">
                    <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Install OIRS Portal</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Add to your home screen for quick access</p>
                    <div className="mt-3 flex gap-2">
                        <button
                            onClick={install}
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-gradient-brand text-white hover:opacity-90 transition-opacity"
                        >
                            Install
                        </button>
                        <button
                            onClick={dismiss}
                            className="text-xs font-medium px-3 py-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        >
                            Not now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
