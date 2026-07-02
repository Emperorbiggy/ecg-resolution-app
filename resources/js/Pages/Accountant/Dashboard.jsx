import { Link } from '@inertiajs/react';
import StaffLayout from '@/Layouts/StaffLayout';
import StatCard from '@/Components/ui/StatCard';
import Badge from '@/Components/ui/Badge';

const icons = {
    pending: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    received: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 01-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75" />
        </svg>
    ),
    reviewing: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
        </svg>
    ),
};

export default function Dashboard({ stats, recentPayments = [] }) {
    const now = new Date();
    const hour = now.getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    return (
        <StaffLayout header="Dashboard">
            <div className="space-y-6 animate-fade-in">
                {/* Greeting */}
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
                        {greeting} ☀️
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                        Here's what's happening today
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <StatCard label="Pending Payments" value={stats.total_pending}   icon={icons.pending}   gradient="bg-amber-400" />
                    <StatCard label="Received"         value={stats.total_received}  icon={icons.received}  gradient="bg-cyan-400" />
                    <StatCard label="Under Review"     value={stats.total_reviewing} icon={icons.reviewing} gradient="bg-blue-400" />
                </div>

                {/* Recent payments */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Recent Payments</h3>
                        <Link href={route('accountant.payments')} className="text-xs text-brand-600 dark:text-brand-400 font-medium hover:underline">
                            View All →
                        </Link>
                    </div>

                    <div className="card overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-100 dark:border-slate-700">
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">IPN</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Merchant</th>
                                        <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Date</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                    {recentPayments.map((p) => (
                                        <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="px-4 py-3">
                                                <Link href={route('accountant.payments.show', p.id)} className="font-mono text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline">
                                                    {p.ipn}
                                                </Link>
                                            </td>
                                            <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{p.merchant_name}</td>
                                            <td className="hidden sm:table-cell px-4 py-3 text-slate-500 dark:text-slate-400">{p.created_at}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex flex-col gap-1">
                                                    <Badge status={p.resolution_status} label={p.resolution_status_label} />
                                                    <Badge status={p.payment_status} label={p.payment_status_label} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </StaffLayout>
    );
}
