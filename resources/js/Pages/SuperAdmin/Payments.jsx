import { useState } from 'react';
import { router } from '@inertiajs/react';
import StaffLayout from '@/Layouts/StaffLayout';
import PaymentTable from '@/Components/shared/PaymentTable';
import SearchBar from '@/Components/ui/SearchBar';

export default function Payments({ payments, filters = {} }) {
    const [search, setSearch]   = useState(filters.search || '');
    const [resStatus, setRes]   = useState(filters.resolution_status || '');
    const [payStatus, setPay]   = useState(filters.payment_status || '');
    const [bank, setBank]       = useState(filters.bank || '');

    const apply = (overrides = {}) => {
        const s   = (overrides.search            !== undefined ? overrides.search            : search)     || undefined;
        const res = (overrides.resolution_status !== undefined ? overrides.resolution_status : resStatus)  || undefined;
        const pay = (overrides.payment_status    !== undefined ? overrides.payment_status    : payStatus)  || undefined;
        const b   = (overrides.bank              !== undefined ? overrides.bank              : bank)       || undefined;
        router.get(route('admin.payments'), {
            search: s, resolution_status: res, payment_status: pay, bank: b,
        }, { preserveState: true, replace: true });
    };

    return (
        <StaffLayout header="All Payments">
            <div className="space-y-4 animate-fade-in">
                <div className="card p-4 flex flex-col sm:flex-row gap-3 flex-wrap">
                    <SearchBar
                        value={search}
                        onChange={(v) => { setSearch(v); apply({ search: v }); }}
                        placeholder="Search IPN, name, email..."
                        className="flex-1 min-w-40"
                    />
                    <select value={resStatus}   onChange={(e) => { setRes(e.target.value);  apply({ resolution_status: e.target.value }); }}  className="input-field sm:w-40">
                        <option value="">All Resolution</option>
                        <option value="open">Open</option>
                        <option value="reviewing">Reviewing</option>
                        <option value="resolved">Resolved</option>
                    </select>
                    <select value={payStatus}   onChange={(e) => { setPay(e.target.value);  apply({ payment_status: e.target.value }); }}  className="input-field sm:w-40">
                        <option value="">All Payment</option>
                        <option value="pending">Pending</option>
                        <option value="received">Received</option>
                        <option value="paid">Paid</option>
                    </select>
                    <select value={bank}        onChange={(e) => { setBank(e.target.value); apply({ bank: e.target.value }); }}  className="input-field sm:w-44">
                        <option value="">All Banks</option>
                        <option value="wema_bank">Wema Bank</option>
                        <option value="alpha_morgan_bank">Alpha Morgan Bank</option>
                    </select>
                </div>

                <PaymentTable
                    payments={payments}
                    detailRoute={(id) => route('admin.payments.show', id)}
                    emptyMessage="No payments match your filters."
                />
            </div>
        </StaffLayout>
    );
}
