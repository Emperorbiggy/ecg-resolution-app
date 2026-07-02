import { useState, useEffect } from 'react';

function isIosSafari() {
    if (typeof window === 'undefined') return false;
    const ua = window.navigator.userAgent;
    return /iphone|ipad|ipod/i.test(ua) && /safari/i.test(ua) && !/crios|fxios|opios/i.test(ua);
}

function isStandalone() {
    if (typeof window === 'undefined') return false;
    return window.navigator.standalone === true ||
        window.matchMedia('(display-mode: standalone)').matches;
}

export function useInstallPrompt() {
    const [prompt, setPrompt] = useState(null);
    const [installed, setInstalled] = useState(false);
    const [ios] = useState(() => isIosSafari());

    useEffect(() => {
        if (isStandalone()) { setInstalled(true); return; }

        const handler = (e) => { e.preventDefault(); setPrompt(e); };
        window.addEventListener('beforeinstallprompt', handler);
        window.addEventListener('appinstalled', () => setInstalled(true));
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

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
