import { useState, useEffect } from 'react';

function isIosSafari() {
    if (typeof window === 'undefined') return false;
    const ua = window.navigator.userAgent;
    return /iphone|ipad|ipod/i.test(ua) && /safari/i.test(ua) && !/crios|fxios|opios/i.test(ua);
}

function isMerchantPwaInstalled() {
    // Only suppress when running as the merchant PWA itself (start_url = /)
    // Not when running inside the staff PWA which also has scope /
    if (typeof window === 'undefined') return false;
    const standalone = window.navigator.standalone === true ||
        window.matchMedia('(display-mode: standalone)').matches;
    // If standalone AND we're at the root (not a staff route), merchant is installed
    const path = window.location.pathname;
    const isStaffRoute = path.startsWith('/login') || path.startsWith('/accountant') ||
        path.startsWith('/resolution-officer') || path.startsWith('/super-admin');
    return standalone && !isStaffRoute;
}

export function useInstallPrompt() {
    const [prompt, setPrompt] = useState(null);
    const [installed, setInstalled] = useState(() => isMerchantPwaInstalled());
    const [ios] = useState(() => isIosSafari());

    useEffect(() => {
        if (installed) return;

        const handler = (e) => { e.preventDefault(); setPrompt(e); };
        window.addEventListener('beforeinstallprompt', handler);
        window.addEventListener('appinstalled', () => setInstalled(true));
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, [installed]);

    const install = async () => {
        if (!prompt) return;
        prompt.prompt();
        const { outcome } = await prompt.userChoice;
        if (outcome === 'accepted') setInstalled(true);
        setPrompt(null);
    };

    const canInstall = !installed && (!!prompt || ios);

    return { canInstall, install, ios };
}
