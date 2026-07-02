import { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import DarkModeToggle from '@/Components/shared/DarkModeToggle';
import OfflineBanner from '@/Components/shared/OfflineBanner';
import InstallPrompt from '@/Components/shared/InstallPrompt';

function NavItem({ href, label, icon, active }) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200
                ${active
                    ? 'bg-brand-600 text-white shadow-brand'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
        >
            <span className="h-5 w-5 shrink-0">{icon}</span>
            {label}
        </Link>
    );
}

const iconMap = {
    dashboard: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
    ),
    payments: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
    ),
    users: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
    ),
    logs: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
        </svg>
    ),
};

function getSidebarItems(role) {
    const base = [
        { href: role === 'accountant' ? route('accountant.dashboard') : role === 'resolution_officer' ? route('resolution.dashboard') : route('admin.dashboard'), label: 'Dashboard', icon: iconMap.dashboard, match: 'dashboard' },
        { href: role === 'accountant' ? route('accountant.payments') : role === 'resolution_officer' ? route('resolution.payments') : route('admin.payments'), label: 'Payments', icon: iconMap.payments, match: 'payments' },
    ];

    if (role === 'super_admin') {
        base.push({ href: route('admin.users'),      label: 'Users',       icon: iconMap.users, match: 'users' });
        base.push({ href: route('admin.audit-logs'), label: 'Audit Logs',  icon: iconMap.logs,  match: 'audit-logs' });
    }

    return base;
}

export default function StaffLayout({ children, header }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const url = usePage().url;
    const items = getSidebarItems(user?.role || 'accountant');

    const logout = () => router.post(route('logout'));

    const Sidebar = ({ mobile = false }) => (
        <div className={`flex flex-col h-full ${mobile ? '' : ''}`}>
            {/* Logo */}
            <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-200/60 dark:border-slate-700/60">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-brand shadow-brand">
                    <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" fill="none"/>
                    </svg>
                </div>
                <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white font-display leading-none">OIRS</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-none mt-0.5">{user?.role_label || 'Portal'}</p>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                {items.map((item) => (
                    <NavItem
                        key={item.href}
                        {...item}
                        active={url.includes(item.match)}
                    />
                ))}
            </nav>

            {/* User */}
            <div className="border-t border-slate-200/60 dark:border-slate-700/60 p-3">
                <div className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-brand text-xs font-bold text-white">
                        {user?.name?.[0]?.toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user?.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                    </div>
                    <button onClick={logout} title="Logout" className="text-slate-400 hover:text-red-500 transition-colors">
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
            <OfflineBanner />

            {/* Desktop sidebar */}
            <aside className="hidden md:flex md:w-60 md:flex-col bg-white dark:bg-slate-900 border-r border-slate-200/60 dark:border-slate-800/60 shrink-0">
                <Sidebar />
            </aside>

            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 flex md:hidden">
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
                    <div className="relative flex w-64 flex-col bg-white dark:bg-slate-900 animate-slide-down">
                        <Sidebar mobile />
                    </div>
                </div>
            )}

            {/* Main */}
            <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
                {/* Top bar */}
                <header className="flex h-16 items-center gap-3 border-b border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 sm:px-6 shrink-0">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>

                    <div className="flex-1 min-w-0">
                        {header && <h1 className="text-base font-semibold text-slate-900 dark:text-white truncate font-display">{header}</h1>}
                    </div>

                    <DarkModeToggle />
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                    {children}
                </main>
            </div>

            <InstallPrompt />
        </div>
    );
}
