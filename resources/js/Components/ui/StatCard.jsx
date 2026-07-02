export default function StatCard({ label, value, icon, gradient, change, suffix = '' }) {
    return (
        <div className="card p-6 overflow-hidden relative group hover:shadow-card-lg hover:-translate-y-0.5 transition-all duration-200">
            {/* Decorative gradient blob */}
            <div
                className={`absolute -right-4 -top-4 h-24 w-24 rounded-full opacity-10 group-hover:opacity-20 transition-opacity ${gradient || 'bg-brand-500'}`}
            />
            <div className="relative">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            {label}
                        </p>
                        <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white font-display">
                            {value}{suffix}
                        </p>
                        {change && (
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{change}</p>
                        )}
                    </div>
                    {icon && (
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${gradient || 'bg-brand-100 dark:bg-brand-900/30'} text-brand-600 dark:text-brand-400`}>
                            {icon}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
