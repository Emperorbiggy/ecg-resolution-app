import { useState } from 'react';
import { router } from '@inertiajs/react';
import StaffLayout from '@/Layouts/StaffLayout';
import SearchBar from '@/Components/ui/SearchBar';
import { Link } from '@inertiajs/react';

const rolePills = {
    merchant:           'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    accountant:         'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    resolution_officer: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
    super_admin:        'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400',
};

export default function AuditLogs({ logs, filters = {}, actions = {} }) {
    const [search,    setSearch]   = useState(filters.search    || '');
    const [ipn,       setIpn]      = useState(filters.ipn       || '');
    const [action,    setAction]   = useState(filters.action    || '');
    const [role,      setRole]     = useState(filters.role      || '');
    const [dateFrom,  setDateFrom] = useState(filters.date_from || '');
    const [dateTo,    setDateTo]   = useState(filters.date_to   || '');

    const apply = (overrides = {}) => {
        const s  = (overrides.search    !== undefined ? overrides.search    : search)   || undefined;
        const i  = (overrides.ipn       !== undefined ? overrides.ipn       : ipn)      || undefined;
        const a  = (overrides.action    !== undefined ? overrides.action    : action)   || undefined;
        const ro = (overrides.role      !== undefined ? overrides.role      : role)     || undefined;
        const df = (overrides.date_from !== undefined ? overrides.date_from : dateFrom) || undefined;
        const dt = (overrides.date_to   !== undefined ? overrides.date_to   : dateTo)   || undefined;
        router.get(route('admin.audit-logs'), {
            search: s, ipn: i, action: a, role: ro, date_from: df, date_to: dt,
        }, { preserveState: true, replace: true });
    };

    const rows = logs?.data ?? [];

    return (
        <StaffLayout header="Audit Logs">
            <div className="space-y-4 animate-fade-in">
                {/* Filters */}
                <div className="card p-4 space-y-3">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <SearchBar
                            value={search}
                            onChange={(v) => { setSearch(v); apply({ search: v }); }}
                            placeholder="Search description or user..."
                            className="flex-1"
                        />
                        <input
                            type="text"
                            value={ipn}
                            onChange={(e) => { setIpn(e.target.value); apply({ ipn: e.target.value }); }}
                            placeholder="Filter by IPN..."
                            className="input-field sm:w-40"
                        />
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <select value={action} onChange={(e) => { setAction(e.target.value); apply({ action: e.target.value }); }} className="input-field flex-1 min-w-36">
                            <option value="">All Actions</option>
                            {Object.entries(actions).map(([k, v]) => (
                                <option key={k} value={k}>{v}</option>
                            ))}
                        </select>
                        <select value={role} onChange={(e) => { setRole(e.target.value); apply({ role: e.target.value }); }} className="input-field flex-1 min-w-36">
                            <option value="">All Roles</option>
                            <option value="merchant">Merchant</option>
                            <option value="accountant">Accountant</option>
                            <option value="resolution_officer">Resolution Officer</option>
                            <option value="super_admin">Super Admin</option>
                        </select>
                        <input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); apply({ date_from: e.target.value }); }} className="input-field flex-1 min-w-36" />
                        <input type="date" value={dateTo}   onChange={(e) => { setDateTo(e.target.value);   apply({ date_to:   e.target.value }); }} className="input-field flex-1 min-w-36" />
                    </div>
                </div>

                {/* Logs table */}
                <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-100 dark:border-slate-700">
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Date</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">User</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Role</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Action</th>
                                    <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">IPN</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Description</th>
                                    <th className="hidden lg:table-cell px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">IP</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                {rows.map((log) => (
                                    <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{log.created_at}</td>
                                        <td className="px-4 py-3">
                                            <div>
                                                <p className="font-medium text-slate-900 dark:text-white text-xs">{log.user_name || '—'}</p>
                                                <p className="text-xs text-slate-400 truncate max-w-28">{log.user_email}</p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${rolePills[log.user_role] || 'bg-slate-100 text-slate-600'}`}>
                                                {log.user_role || '—'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{log.action_label}</span>
                                        </td>
                                        <td className="hidden md:table-cell px-4 py-3">
                                            {log.ipn && <span className="font-mono text-xs text-brand-600 dark:text-brand-400">{log.ipn}</span>}
                                        </td>
                                        <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-400 max-w-64 truncate">{log.description}</td>
                                        <td className="hidden lg:table-cell px-4 py-3 text-xs text-slate-400 font-mono">{log.ip_address}</td>
                                    </tr>
                                ))}
                                {!rows.length && (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-400">No audit logs match your filters</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {logs?.links && logs.last_page > 1 && (
                        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-700 px-4 py-3">
                            <p className="text-xs text-slate-500">{logs.from}–{logs.to} of {logs.total}</p>
                            <div className="flex gap-1">
                                {logs.links.map((link, i) => (
                                    link.url ? (
                                        <Link key={i} href={link.url} dangerouslySetInnerHTML={{ __html: link.label }}
                                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${link.active ? 'bg-brand-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                                        />
                                    ) : (
                                        <span key={i} dangerouslySetInnerHTML={{ __html: link.label }} className="px-3 py-1 text-xs text-slate-300 dark:text-slate-600" />
                                    )
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </StaffLayout>
    );
}
