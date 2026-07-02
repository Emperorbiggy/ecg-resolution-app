import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const sizes = {
    sm:  'max-w-md',
    md:  'max-w-lg',
    lg:  'max-w-2xl',
    xl:  'max-w-4xl',
    full: 'max-w-7xl',
};

export default function Modal({ show = false, onClose, size = 'md', title, children }) {
    const overlayRef = useRef(null);

    useEffect(() => {
        if (show) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [show]);

    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose?.(); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [onClose]);

    if (!show) return null;

    return createPortal(
        <div
            ref={overlayRef}
            onClick={(e) => { if (e.target === overlayRef.current) onClose?.(); }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
        >
            <div className={`w-full ${sizes[size]} animate-scale-in`}>
                <div className="card overflow-hidden">
                    {title && (
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 px-6 py-4">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white font-display">{title}</h2>
                            <button
                                onClick={onClose}
                                className="rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            >
                                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    )}
                    <div className="p-6">{children}</div>
                </div>
            </div>
        </div>,
        document.body
    );
}
