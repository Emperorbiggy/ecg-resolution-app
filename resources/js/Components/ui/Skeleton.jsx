export function Skeleton({ className = '' }) {
    return <div className={`skeleton ${className}`} />;
}

export function SkeletonCard() {
    return (
        <div className="card p-6 space-y-4">
            <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                </div>
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
        </div>
    );
}

export function SkeletonTable({ rows = 5, cols = 5 }) {
    return (
        <div className="card overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700">
                <Skeleton className="h-8 w-48" />
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {Array.from({ length: rows }).map((_, i) => (
                    <div key={i} className="flex gap-4 p-4">
                        {Array.from({ length: cols }).map((_, j) => (
                            <Skeleton key={j} className="h-4 flex-1" />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export function SkeletonStat() {
    return (
        <div className="card p-6 space-y-3">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-24" />
        </div>
    );
}
