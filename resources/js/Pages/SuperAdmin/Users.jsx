import { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import StaffLayout from '@/Layouts/StaffLayout';
import Button from '@/Components/ui/Button';
import Badge from '@/Components/ui/Badge';
import SearchBar from '@/Components/ui/SearchBar';
import Modal from '@/Components/ui/Modal';
import ConfirmDialog from '@/Components/ui/ConfirmDialog';
import InputField, { SelectField } from '@/Components/ui/InputField';
import { useToast } from '@/Components/ui/Toast';

function CreateUserModal({ show, onClose }) {
    const toast = useToast();
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '', email: '', role: 'accountant', password: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.users.store'), {
            onSuccess: () => { toast.success('User created.'); reset(); onClose(); },
        });
    };

    return (
        <Modal show={show} onClose={onClose} title="Create User Account" size="sm">
            <form onSubmit={submit} className="space-y-4">
                <InputField label="Full Name" required value={data.name} onChange={(e) => setData('name', e.target.value)} error={errors.name} />
                <InputField label="Email Address" type="email" required value={data.email} onChange={(e) => setData('email', e.target.value)} error={errors.email} />
                <SelectField label="Role" required value={data.role} onChange={(e) => setData('role', e.target.value)} error={errors.role}>
                    <option value="accountant">Accountant</option>
                    <option value="resolution_officer">Resolution Officer</option>
                    <option value="super_admin">Super Admin</option>
                </SelectField>
                <InputField label="Password" type="password" required value={data.password} onChange={(e) => setData('password', e.target.value)} error={errors.password} />
                <div className="flex gap-3 pt-2">
                    <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
                    <Button type="submit" className="flex-1" loading={processing}>Create User</Button>
                </div>
            </form>
        </Modal>
    );
}

export default function Users({ users, filters = {} }) {
    const [search, setSearch]     = useState(filters.search || '');
    const [role, setRole]         = useState(filters.role || '');
    const [showCreate, setCreate] = useState(false);
    const [deleteTarget, setDel]  = useState(null);
    const [resetTarget, setReset] = useState(null);
    const [newPassword, setNewPwd]= useState('');
    const toast = useToast();

    const { delete: destroy, put, processing } = useForm();

    const apply = (overrides = {}) => {
        const s = (overrides.search !== undefined ? overrides.search : search) || undefined;
        const r = (overrides.role   !== undefined ? overrides.role   : role)   || undefined;
        router.get(route('admin.users'), {
            search: s, role: r,
        }, { preserveState: true, replace: true });
    };

    const handleDelete = () => {
        destroy(route('admin.users.destroy', deleteTarget.id), {
            onSuccess: () => { toast.success('User deleted.'); setDel(null); },
        });
    };

    const handleToggle = (user) => {
        put(route('admin.users.toggle-active', user.id), {
            onSuccess: () => toast.success(`User ${user.is_active ? 'deactivated' : 'activated'}.`),
        });
    };

    const handleReset = () => {
        put(route('admin.users.reset-password', resetTarget.id), {
            onSuccess: (page) => {
                const pwd = page.props.flash?.new_password;
                if (pwd) setNewPwd(pwd);
                setReset(null);
                toast.success('Password reset.');
            },
        });
    };

    const rows = users?.data ?? [];

    return (
        <StaffLayout header="User Management">
            <div className="space-y-4 animate-fade-in">
                <div className="card p-4 flex flex-col sm:flex-row gap-3">
                    <SearchBar
                        value={search}
                        onChange={(v) => { setSearch(v); apply({ search: v }); }}
                        placeholder="Search name or email..."
                        className="flex-1"
                    />
                    <select value={role} onChange={(e) => { setRole(e.target.value); apply({ role: e.target.value }); }} className="input-field sm:w-44">
                        <option value="">All Roles</option>
                        <option value="accountant">Accountant</option>
                        <option value="resolution_officer">Resolution Officer</option>
                        <option value="super_admin">Super Admin</option>
                    </select>
                    <Button onClick={() => setCreate(true)} className="shrink-0">
                        + New User
                    </Button>
                </div>

                <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-100 dark:border-slate-700">
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Name</th>
                                    <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Email</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Role</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Joined</th>
                                    <th className="px-4 py-3" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                {rows.map((u) => (
                                    <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-4 py-3.5 font-medium text-slate-900 dark:text-white">{u.name}</td>
                                        <td className="hidden sm:table-cell px-4 py-3.5 text-slate-500 dark:text-slate-400">{u.email}</td>
                                        <td className="px-4 py-3.5">
                                            <Badge status={u.role} label={u.role_label} dot={false} />
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <Badge status={u.is_active ? 'active' : 'inactive'} label={u.is_active ? 'Active' : 'Inactive'} />
                                        </td>
                                        <td className="px-4 py-3.5 text-slate-500 dark:text-slate-400 text-xs">{u.created_at}</td>
                                        <td className="px-4 py-3.5 text-right">
                                            <div className="flex items-center gap-1 justify-end">
                                                <Button variant="ghost" size="sm" className="text-xs" onClick={() => handleToggle(u)}>
                                                    {u.is_active ? 'Deactivate' : 'Activate'}
                                                </Button>
                                                <Button variant="ghost" size="sm" className="text-xs" onClick={() => setReset(u)}>
                                                    Reset Pwd
                                                </Button>
                                                <Button variant="ghost" size="sm" className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => setDel(u)}>
                                                    Delete
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {!rows.length && (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-400">No users found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <CreateUserModal show={showCreate} onClose={() => setCreate(false)} />

            <ConfirmDialog
                show={!!deleteTarget}
                onClose={() => setDel(null)}
                onConfirm={handleDelete}
                loading={processing}
                title="Delete User"
                message={`Delete ${deleteTarget?.name} (${deleteTarget?.email})? This cannot be undone.`}
                confirmLabel="Delete"
                variant="danger"
            />

            <ConfirmDialog
                show={!!resetTarget}
                onClose={() => setReset(null)}
                onConfirm={handleReset}
                loading={processing}
                title="Reset Password"
                message={`Reset password for ${resetTarget?.name}? A new random password will be generated.`}
                confirmLabel="Reset"
            />

            {/* Show new password */}
            <Modal show={!!newPassword} onClose={() => setNewPwd('')} title="Password Reset" size="sm">
                <div className="space-y-3 text-center">
                    <p className="text-sm text-slate-600 dark:text-slate-400">New password for the user:</p>
                    <div className="rounded-xl bg-slate-100 dark:bg-slate-700 p-3 font-mono text-lg font-bold text-slate-900 dark:text-white tracking-widest">
                        {newPassword}
                    </div>
                    <p className="text-xs text-slate-400">Share this securely with the user. It will not be shown again.</p>
                    <Button className="w-full" onClick={() => setNewPwd('')}>Done</Button>
                </div>
            </Modal>
        </StaffLayout>
    );
}
