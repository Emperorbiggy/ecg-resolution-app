<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Services\AuditLogService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status'           => session('status'),
        ]);
    }

    public function store(LoginRequest $request): RedirectResponse
    {
        try {
            $request->authenticate();
        } catch (\Illuminate\Validation\ValidationException $e) {
            AuditLogService::log([
                'user_id'     => null,
                'user_name'   => null,
                'user_email'  => $request->email,
                'user_role'   => null,
                'action'      => 'login_failed',
                'description' => "Failed login attempt for {$request->email}",
            ], $request);

            throw $e;
        }

        $request->session()->regenerate();

        $user = Auth::user();

        AuditLogService::log([
            'action'      => 'user_logged_in',
            'description' => "{$user->name} ({$user->email}) logged in",
        ], $request);

        return redirect()->intended(route('dashboard', absolute: false));
    }

    public function destroy(Request $request): RedirectResponse
    {
        $user = Auth::user();

        if ($user) {
            AuditLogService::log([
                'action'      => 'user_logged_out',
                'description' => "{$user->name} ({$user->email}) logged out",
            ], $request);
        }

        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
