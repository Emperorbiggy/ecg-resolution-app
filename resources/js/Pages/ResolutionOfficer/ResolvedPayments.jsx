import { useState } from 'react';
import { router, Link } from '@inertiajs/react';
import StaffLayout from '@/Layouts/StaffLayout';
import PaymentTable from '@/Components/shared/PaymentTable';
import SearchBar from '@/Components/ui/SearchBar';

export default function ResolvedPayments({ payments, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');

    const applyFilters = (newSearch = search) => {
        router.get(route('resolution.payments.resolved'), {
            search: newSearch || undefined,
        }, { preserveState: true, replace: true });
    };

    return (
        <StaffLayout header="Resolved Payments">
            <div className="space-y-4 animate-fade-in">

                {/* Tab strip */}
                <div className="flex gap-1 border-b border-slate-200 dark:border-slate-700">
                    <Link
                        href={route('resolution.payments')}
                        className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                    >
                        Awaiting Resolution
                    </Link>
                    <span className="px-4 py-2 text-sm font-semibold text-brand-600 dark:text-brand-400 border-b-2 border-brand-600 dark:border-brand-400 -mb-px">
                        Resolved
                    </span>
                </div>

                {/* Search */}
                <div className="card p-4">
                    <SearchBar
                        value={search}
                        onChange={(v) => { setSearch(v); applyFilters(v); }}
                        placeholder="Search by IPN or merchant name..."
                    />
                </div>

                <PaymentTable
                    payments={payments}
                    detailRoute={(id) => route('resolution.payments.show', id)}
                    emptyMessage="No resolved payments yet."
                />
            </div>
        </StaffLayout>
    );
}
