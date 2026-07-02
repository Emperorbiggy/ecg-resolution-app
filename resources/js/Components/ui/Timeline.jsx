const roleColors = {
    merchant:           'border-amber-400 bg-amber-50 dark:bg-amber-900/20',
    accountant:         'border-blue-400 bg-blue-50 dark:bg-blue-900/20',
    resolution_officer: 'border-cyan-400 bg-cyan-50 dark:bg-cyan-900/20',
    super_admin:        'border-violet-400 bg-violet-50 dark:bg-violet-900/20',
};

const roleDot = {
    merchant:           'bg-amber-400',
    accountant:         'bg-blue-400',
    resolution_officer: 'bg-cyan-400',
    super_admin:        'bg-violet-400',
};

export default function Timeline({ items = [] }) {
    if (!items.length) {
        return (
            <p className="text-sm text-slate-400 dark:text-slate-500 italic">No activity recorded yet.</p>
        );
    }

    return (
        <div className="relative space-y-4">
            {/* Vertical line */}
            <div className="absolute left-4 top-4 bottom-4 w-px bg-slate-200 dark:bg-slate-700" />

            {items.map((item, i) => (
                <div key={item.id || i} className="relative flex gap-4 animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
                    {/* Dot */}
                    <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center">
                        <div className={`h-3 w-3 rounded-full border-2 border-white dark:border-slate-900 shadow-sm ${roleDot[item.role] || 'bg-slate-400'}`} />
                    </div>

                    {/* Content */}
                    <div className={`flex-1 rounded-xl border-l-4 p-3 text-sm ${roleColors[item.role] || 'border-slate-300 bg-slate-50 dark:bg-slate-800'}`}>
                        <p className="font-medium text-slate-900 dark:text-white">{item.description}</p>
                        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{item.date}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
