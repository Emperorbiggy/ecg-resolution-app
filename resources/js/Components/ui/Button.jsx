import { forwardRef } from 'react';

const variants = {
    primary:   'btn-primary',
    secondary: 'btn-secondary',
    danger:    'btn-danger',
    ghost:     'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200',
    link:      'inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline',
};

const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: '',
    lg: 'px-8 py-4 text-base',
};

const Button = forwardRef(function Button(
    { variant = 'primary', size = 'md', className = '', children, loading = false, ...props },
    ref
) {
    return (
        <button
            ref={ref}
            disabled={loading || props.disabled}
            className={`${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {loading && (
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
            )}
            {children}
        </button>
    );
});

export default Button;
