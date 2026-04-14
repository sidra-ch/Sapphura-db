<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckPermission
{
    public function handle(Request $request, Closure $next, string $permission)
    {
        $user = $request->user();

        if (!$user) {
            abort(403, 'Unauthorized.');
        }

        // Super admins (role string = 'admin' or role name = 'super_admin') bypass permission checks
        if ($user->role === 'admin' && (!$user->role_id || $user->roleModel?->name === 'super_admin')) {
            return $next($request);
        }

        // Check RBAC permission
        if ($user->role_id && $user->hasPermission($permission)) {
            return $next($request);
        }

        abort(403, 'You do not have permission to access this resource.');
    }
}
