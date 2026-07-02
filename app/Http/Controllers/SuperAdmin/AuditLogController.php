<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AuditLogController extends Controller
{
    public function index(Request $request): Response
    {
        $query = AuditLog::query();

        if ($search = $request->get('search')) {
            $query->where('description', 'like', "%{$search}%")
                  ->orWhere('user_email', 'like', "%{$search}%")
                  ->orWhere('user_name', 'like', "%{$search}%");
        }

        if ($ipn = $request->get('ipn')) {
            $query->where('ipn', $ipn);
        }

        if ($action = $request->get('action')) {
            $query->where('action', $action);
        }

        if ($role = $request->get('role')) {
            $query->where('user_role', $role);
        }

        if ($from = $request->get('date_from')) {
            $query->whereDate('created_at', '>=', $from);
        }

        if ($to = $request->get('date_to')) {
            $query->whereDate('created_at', '<=', $to);
        }

        $logs = $query->latest('created_at')->paginate(25)->through(fn ($log) => [
            'id'           => $log->id,
            'user_name'    => $log->user_name,
            'user_email'   => $log->user_email,
            'user_role'    => $log->user_role,
            'action'       => $log->action,
            'action_label' => $log->action_label,
            'ipn'          => $log->ipn,
            'description'  => $log->description,
            'ip_address'   => $log->ip_address,
            'created_at'   => $log->created_at->format('d M Y, H:i:s'),
        ]);

        return Inertia::render('SuperAdmin/AuditLogs', [
            'logs'    => $logs,
            'filters' => $request->only('search', 'ipn', 'action', 'role', 'date_from', 'date_to'),
            'actions' => config('roles.audit_actions'),
        ]);
    }
}
