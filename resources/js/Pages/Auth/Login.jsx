import { useEffect } from 'react';
import { useForm, Link } from '@inertiajs/react';
import InputField from '@/Components/ui/InputField';
import Button from '@/Components/ui/Button';
import DarkModeToggle from '@/Components/shared/DarkModeToggle';
import InstallPrompt from '@/Components/shared/InstallPrompt';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email:    '',
        password: '',
        remember: false,
    });

    useEffect(() => () => reset('password'), []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/50 to-slate-950 flex items-center justify-center p-4">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-brand-600/10 blur-3xl" />
                <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-cyan-600/10 blur-3xl" />
            </div>

            <div className="relative w-full max-w-md animate-slide-up">
                <div className="absolute top-0 right-0">
                    <DarkModeToggle />
                </div>

                <div className="text-center mb-8">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-brand shadow-brand mb-4">
                        <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-white font-display">OIRS Staff Portal</h1>
                    <p className="text-blue-300 text-sm mt-1">Osun State Internal Revenue Service</p>
                </div>

                <div className="glass-dark rounded-3xl p-8">
                    <h2 className="text-lg font-semibold text-white mb-6">Sign in to your account</h2>

                    {status && (
                        <div className="mb-4 rounded-xl bg-emerald-900/30 border border-emerald-700 p-3 text-sm text-emerald-400">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-4">
                        <InputField
                            label="Email Address"
                            type="email"
                            placeholder="you@oirs.gov.ng"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            error={errors.email}
                            autoComplete="username"
                            required
                        />
                        <InputField
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            error={errors.password}
                            autoComplete="current-password"
                            required
                        />

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="rounded border-slate-600 bg-slate-700 text-brand-500 focus:ring-brand-500"
                                />
                                Remember me
                            </label>
                            {canResetPassword && (
                                <Link href={route('password.request')} className="text-sm text-brand-400 hover:text-brand-300 transition-colors">
                                    Forgot password?
                                </Link>
                            )}
                        </div>

                        <Button type="submit" loading={processing} className="w-full py-3.5 mt-2">
                            Sign In
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link href="/" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
                            ← Back to Merchant Portal
                        </Link>
                    </div>
                </div>

                <p className="text-center text-xs text-slate-600 mt-6">
                    © {new Date().getFullYear()} Osun State Internal Revenue Service
                </p>
            </div>

            <InstallPrompt />
        </div>
    );
}
