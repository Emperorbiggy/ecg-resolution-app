import { Link } from '@inertiajs/react';
import StaffLayout from '@/Layouts/StaffLayout';
import StatCard from '@/Components/ui/StatCard';

const statConfigs = [
    { key: 'total_submissions',         label: 'Total Submissions',         gradient: 'bg-brand-400' },
    { key: 'open_resolutions',          label: 'Open Resolutions',          gradient: 'bg-amber-400' },
    { key: 'pending_verification',      label: 'Pending Verification',      gradient: 'bg-orange-400' },
    { key: 'payments_received',         label: 'Payments Received',         gradient: 'bg-cyan-400' },
    { key: 'payments_resolved',         label: 'Payments Resolved',         gradient: 'bg-emerald-400' },
    { key: 'total_merchants',           label: 'Total Merchants',           gradient: 'bg-violet-400' },
    { key: 'total_accountants',         label: 'Accountants',               gradient: 'bg-blue-400' },
    { key: 'total_resolution_officers', label: 'Resolution Officers',       gradient: 'bg-pink-400' },
];

export default function Dashboard({ stats, recentActivities = [] }) {
    const roleColors = {
        merchant:           'text-amber-600 dark:text-amber-400',
        accountant:         'text-blue-600 dark:text-blue-400',
        resolution_officer: 'text-cyan-600 dark:text-cyan-400',
        super_admin:        'text-violet-600 dark:text-violet-400',
    };

    return (
        <StaffLayout header="Super Admin Dashboard">
            <div className="space-y-6 animate-fade-in">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">System Overview</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Complete visibility into all platform activity</p>
                </div>

                {/* 8-card stats grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {statConfigs.map(({ key, label, gradient }) => (
                        <StatCard
                            key={key}
                            label={label}
                            value={stats[key] ?? 0}
                            gradient={gradient}
                        />
                    ))}
                </div>

                {/* Quick links */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                        { href: route('admin.payments'),   label: 'View All Payments',  icon: '📋' },
                        { href: route('admin.users'),      label: 'Manage Users',       icon: '👥' },
                        { href: route('admin.audit-logs'), label: 'View Audit Logs',    icon: '🔍' },
                    ].map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="card-hover flex items-center gap-3 p-4"
                        >
                            <span className="text-2xl">{item.icon}</span>
                            <span className="text-sm font-semibold text-slate-900 dark:text-white">{item.label}</span>
                            <svg className="ml-auto h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                        </Link>
                    ))}
                </div>

                {/* Recent activity */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Recent System Activity</h3>
                        <Link href={route('admin.audit-logs')} className="text-xs text-brand-600 dark:text-brand-400 font-medium hover:underline">
                            View All Logs →
                        </Link>
                    </div>
                    <div className="card divide-y divide-slate-100 dark:divide-slate-700/50">
                        {recentActivities.map((activity) => (
                            <div key={activity.id} className="flex items-start gap-3 p-4">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700">
                                    <span className={`text-xs font-bold ${roleColors[activity.user_role] || 'text-slate-500'}`}>
                                        {(activity.user_name || activity.user_email || '?')[0]?.toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-slate-700 dark:text-slate-300">{activity.description}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        {activity.ipn && (
                                            <span className="font-mono text-xs text-brand-600 dark:text-brand-400">{activity.ipn}</span>
                                        )}
                                        <span className="text-xs text-slate-400 dark:text-slate-500">{activity.created_at}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {!recentActivities.length && (
                            <div className="p-8 text-center text-sm text-slate-400">No recent activity</div>
                        )}
                    </div>
                </div>
            </div>
        </StaffLayout>
    );
}
