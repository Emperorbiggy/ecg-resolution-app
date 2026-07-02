<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class UserService
{
    public function create(array $data, Request $request): User
    {
        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => bcrypt($data['password']),
            'role'     => $data['role'],
            'is_active' => true,
        ]);

        AuditLogService::log([
            'action'      => 'user_created',
            'entity_type' => 'user',
            'entity_id'   => $user->id,
            'description' => "User account created for {$user->email} with role {$user->role}",
        ], $request);

        return $user;
    }

    public function update(User $user, array $data, Request $request): User
    {
        $user->update(array_filter([
            'name'  => $data['name'] ?? null,
            'email' => $data['email'] ?? null,
            'role'  => $data['role'] ?? null,
        ]));

        AuditLogService::log([
            'action'      => 'user_updated',
            'entity_type' => 'user',
            'entity_id'   => $user->id,
            'description' => "User account updated for {$user->email}",
        ], $request);

        return $user->fresh();
    }

    public function toggleActive(User $user, Request $request): User
    {
        $user->update(['is_active' => ! $user->is_active]);

        $action = $user->is_active ? 'user_activated' : 'user_deactivated';
        $verb   = $user->is_active ? 'activated'       : 'deactivated';

        AuditLogService::log([
            'action'      => $action,
            'entity_type' => 'user',
            'entity_id'   => $user->id,
            'description' => "User account {$verb} for {$user->email}",
        ], $request);

        return $user->fresh();
    }

    public function resetPassword(User $user, Request $request): string
    {
        $password = Str::random(12);
        $user->update(['password' => bcrypt($password)]);

        AuditLogService::log([
            'action'      => 'password_reset',
            'entity_type' => 'user',
            'entity_id'   => $user->id,
            'description' => "Password reset for {$user->email}",
        ], $request);

        return $password;
    }

    public function delete(User $user, Request $request): void
    {
        AuditLogService::log([
            'action'      => 'user_deleted',
            'entity_type' => 'user',
            'entity_id'   => $user->id,
            'description' => "User account deleted for {$user->email}",
        ], $request);

        $user->delete();
    }
}
