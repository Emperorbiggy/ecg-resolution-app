export default function EmptyState({
    icon,
    title = 'Nothing here yet',
    description,
    action,
}) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500">
                {icon || (
                    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                )}
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h3>
            {description && (
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-sm">{description}</p>
            )}
            {action && <div className="mt-4">{action}</div>}
        </div>
    );
}
