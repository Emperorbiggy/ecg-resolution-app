import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { ToastProvider } from './Components/ui/Toast';

// Restore dark mode before first paint
try {
    const dark = localStorage.getItem('oirs_dark');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (dark === 'true' || (dark === null && prefersDark)) {
        document.documentElement.classList.add('dark');
    }
} catch {}

const appName = import.meta.env.VITE_APP_NAME || 'OIRS Merchant Portal';

createInertiaApp({
    title: (title) => title ? `${title} — ${appName}` : appName,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const app = (
            <ToastProvider>
                <App {...props} />
            </ToastProvider>
        );

        if (import.meta.env.SSR) {
            hydrateRoot(el, app);
            return;
        }

        createRoot(el).render(app);
    },
    progress: {
        color: '#2563eb',
        showSpinner: false,
    },
});
