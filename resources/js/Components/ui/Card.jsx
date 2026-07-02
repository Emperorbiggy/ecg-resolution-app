export function Card({ className = '', glass = false, hover = false, children, ...props }) {
    const base = glass
        ? 'glass rounded-2xl p-6'
        : 'card p-6';
    const hoverClass = hover ? 'hover:shadow-card-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer' : '';

    return (
        <div className={`${base} ${hoverClass} ${className}`} {...props}>
            {children}
        </div>
    );
}

export function CardHeader({ className = '', children }) {
    return (
        <div className={`mb-4 ${className}`}>
            {children}
        </div>
    );
}

export function CardTitle({ className = '', children }) {
    return (
        <h3 className={`text-lg font-semibold text-slate-900 dark:text-white font-display ${className}`}>
            {children}
        </h3>
    );
}

export function CardBody({ className = '', children }) {
    return <div className={className}>{children}</div>;
}
