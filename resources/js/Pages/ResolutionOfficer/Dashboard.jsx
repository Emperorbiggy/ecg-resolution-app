import { Link } from '@inertiajs/react';
import StaffLayout from '@/Layouts/StaffLayout';
import StatCard from '@/Components/ui/StatCard';
import Badge from '@/Components/ui/Badge';

export default function Dashboard({ stats, recentPayments = [] }) {
    return (
        <StaffLayout header="Dashboard">
            <div className="space-y-6 animate-fade-in">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">Resolution Dashboard</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Payments verified by accountants are listed here for resolution</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <StatCard
                        label="Awaiting Resolution"
                        value={stats.awaiting_resolution}
                        gradient="bg-amber-400"
                        icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    />
                    <StatCard
                        label="Resolved Today"
                        value={stats.resolved_today}
                        gradient="bg-emerald-400"
                        icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    />
                    <StatCard
                        label="Total Resolved"
                        value={stats.total_resolved}
                        gradient="bg-blue-400"
                        icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" /></svg>}
                    />
                </div>

                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Payments Awaiting Resolution</h3>
                        <Link href={route('resolution.payments')} className="text-xs text-brand-600 dark:text-brand-400 font-medium hover:underline">
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
                                        <th className="px-4 py-3" />
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                    {recentPayments.map((p) => (
                                        <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="px-4 py-3">
                                                <Link href={route('resolution.payments.show', p.id)} className="font-mono text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline">
                                                    {p.ipn}
                                                </Link>
                                            </td>
                                            <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{p.merchant_name}</td>
                                            <td className="hidden sm:table-cell px-4 py-3 text-slate-500 dark:text-slate-400">{p.created_at}</td>
                                            <td className="px-4 py-3">
                                                <Badge status={p.payment_status} label={p.payment_status_label} />
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <Link href={route('resolution.payments.show', p.id)} className="text-xs font-medium text-brand-600 dark:text-brand-400 hover:underline">
                                                    Resolve →
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                    {!recentPayments.length && (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-400">
                                                No payments awaiting resolution
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </StaffLayout>
    );
}
