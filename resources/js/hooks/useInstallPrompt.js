import { useState, useEffect } from 'react';

export function useInstallPrompt() {
    const [prompt, setPrompt] = useState(null);
    const [installed, setInstalled] = useState(false);

    useEffect(() => {
        const handler = (e) => {
            e.preventDefault();
            setPrompt(e);
        };
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

    const canInstall = !!prompt && !installed;

    return { canInstall, install };
}
