import { Link } from '@inertiajs/react';
import Badge from '@/Components/ui/Badge';
import EmptyState from '@/Components/ui/EmptyState';

export default function PaymentTable({ payments, detailRoute, emptyMessage = 'No payments found.' }) {
    const rows = payments?.data ?? payments ?? [];

    if (!rows.length) {
        return (
            <div className="card">
                <EmptyState
                    title="No payments found"
                    description={emptyMessage}
                />
            </div>
        );
    }

    return (
        <div className="card overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-100 dark:border-slate-700">
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">IPN</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Merchant</th>
                            <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Bank</th>
                            <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Date</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</th>
                            <th className="px-4 py-3" />
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                        {rows.map((p) => (
                            <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="px-4 py-3.5">
                                    <span className="font-mono text-xs font-semibold text-brand-600 dark:text-brand-400">{p.ipn}</span>
                                </td>
                                <td className="px-4 py-3.5">
                                    <span className="font-medium text-slate-900 dark:text-white">{p.merchant_name}</span>
                                </td>
                                <td className="hidden sm:table-cell px-4 py-3.5 text-slate-500 dark:text-slate-400">
                                    {p.bank_label}
                                </td>
                                <td className="hidden md:table-cell px-4 py-3.5 text-slate-500 dark:text-slate-400">
                                    {p.created_at}
                                </td>
                                <td className="px-4 py-3.5">
                                    <div className="flex flex-col gap-1">
                                        <Badge status={p.resolution_status} label={p.resolution_status_label} />
                                        <Badge status={p.payment_status}    label={p.payment_status_label} />
                                    </div>
                                </td>
                                <td className="px-4 py-3.5 text-right">
                                    <Link
                                        href={detailRoute(p.id)}
                                        className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 dark:text-brand-400 hover:underline"
                                    >
                                        View
                                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                        </svg>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {payments?.links && payments.last_page > 1 && (
                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-700 px-4 py-3">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Showing {payments.from}–{payments.to} of {payments.total}
                    </p>
                    <div className="flex gap-1">
                        {payments.links.map((link, i) => (
                            link.url ? (
                                <Link
                                    key={i}
                                    href={link.url}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors
                                        ${link.active
                                            ? 'bg-brand-600 text-white'
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                                        }`}
                                />
                            ) : (
                                <span
                                    key={i}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className="px-3 py-1 rounded-lg text-xs text-slate-300 dark:text-slate-600"
                                />
                            )
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
