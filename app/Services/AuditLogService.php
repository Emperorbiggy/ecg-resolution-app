<?php

namespace App\Services;

use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuditLogService
{
    public static function log(array $data, ?Request $request = null): AuditLog
    {
        $user = Auth::user();

        return AuditLog::create([
            'user_id'     => $data['user_id']    ?? ($user?->id),
            'user_name'   => $data['user_name']  ?? ($user?->name),
            'user_email'  => $data['user_email'] ?? ($user?->email),
            'user_role'   => $data['user_role']  ?? ($user?->role ?? 'merchant'),
            'action'      => $data['action'],
            'entity_type' => $data['entity_type'] ?? null,
            'entity_id'   => $data['entity_id']   ?? null,
            'ipn'         => $data['ipn']          ?? null,
            'description' => $data['description'],
            'ip_address'  => $data['ip_address'] ?? $request?->ip(),
            'user_agent'  => $data['user_agent'] ?? $request?->userAgent(),
            'created_at'  => now(),
        ]);
    }

    public static function getTimeline(string $ipn): \Illuminate\Support\Collection
    {
        return AuditLog::where('ipn', $ipn)
            ->orderBy('created_at')
            ->get()
            ->map(fn ($log) => [
                'id'          => $log->id,
                'action'      => $log->action,
                'action_label' => $log->action_label,
                'description' => $log->description,
                'date'        => $log->created_at->format('d M Y, H:i'),
                'role'        => $log->user_role,
                'user_name'   => $log->user_name,
                'completed'   => true,
            ]);
    }
}
