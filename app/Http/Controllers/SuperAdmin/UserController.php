<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Http\Requests\SuperAdmin\CreateUserRequest;
use App\Http\Requests\SuperAdmin\UpdateUserRequest;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function __construct(private readonly UserService $userService) {}

    public function index(Request $request): Response
    {
        $query = User::query();

        if ($search = $request->get('search')) {
            $query->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
        }

        if ($role = $request->get('role')) {
            $query->where('role', $role);
        }

        $users = $query->latest()->paginate(20)->through(fn ($u) => [
            'id'         => $u->id,
            'name'       => $u->name,
            'email'      => $u->email,
            'role'       => $u->role,
            'role_label' => $u->role_label,
            'is_active'  => $u->is_active,
            'created_at' => $u->created_at->format('d M Y'),
        ]);

        return Inertia::render('SuperAdmin/Users', [
            'users'   => $users,
            'filters' => $request->only('search', 'role'),
        ]);
    }

    public function store(CreateUserRequest $request)
    {
        $this->userService->create($request->validated(), $request);

        return redirect()->route('admin.users')
            ->with('success', 'User account created successfully.');
    }

    public function update(UpdateUserRequest $request, User $user)
    {
        $this->userService->update($user, $request->validated(), $request);

        return redirect()->route('admin.users')
            ->with('success', 'User account updated successfully.');
    }

    public function destroy(User $user, Request $request)
    {
        abort_if($user->id === auth()->id(), 422, 'You cannot delete your own account.');

        $this->userService->delete($user, $request);

        return redirect()->route('admin.users')
            ->with('success', 'User account deleted.');
    }

    public function toggleActive(User $user, Request $request)
    {
        abort_if($user->id === auth()->id(), 422, 'You cannot deactivate your own account.');

        $this->userService->toggleActive($user, $request);

        $status = $user->fresh()->is_active ? 'activated' : 'deactivated';

        return redirect()->back()
            ->with('success', "User account {$status} successfully.");
    }

    public function resetPassword(User $user, Request $request)
    {
        $newPassword = $this->userService->resetPassword($user, $request);

        return redirect()->back()
            ->with([
                'success'      => 'Password reset successfully.',
                'new_password' => $newPassword,
            ]);
    }
}
