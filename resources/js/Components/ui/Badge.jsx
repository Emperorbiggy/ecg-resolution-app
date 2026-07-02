const statusMap = {
    // Resolution
    open:       'badge-open',
    reviewing:  'badge-reviewing',
    resolved:   'badge-resolved',
    // Payment
    pending:    'badge-pending',
    received:   'badge-received',
    paid:       'badge-paid',
    // Roles
    super_admin:        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400',
    accountant:         'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    resolution_officer: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
    merchant:           'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
    active:     'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
    inactive:   'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

const dotColors = {
    open:       'bg-amber-500',
    reviewing:  'bg-blue-500',
    resolved:   'bg-emerald-500',
    pending:    'bg-slate-400',
    received:   'bg-cyan-500',
    paid:       'bg-emerald-500',
    active:     'bg-emerald-500',
    inactive:   'bg-red-500',
};

export default function Badge({ status, label, dot = true, className = '' }) {
    const cls = statusMap[status] || 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700';
    const dotCls = dotColors[status] || 'bg-slate-400';

    return (
        <span className={`${cls} ${className}`}>
            {dot && <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${dotCls}`} />}
            {label}
        </span>
    );
}
