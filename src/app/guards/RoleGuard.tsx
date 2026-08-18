import { useAuthStore } from '@/stores/auth.store'
import { useLocation, Outlet } from 'react-router-dom'
import { getRoutePermissionCode } from '@/config/permissions'
import ForbiddenPage from '@/features/auth/pages/ForbiddenPage'

/**
 * Guard: Permission-based route access (runs after ProtectedRoute).
 * Route listed in ROUTE_PERMISSION_CODES → check hasPermission.
 * Route not listed → open to any authenticated user.
 */
export function RoleGuard() {
  const hasPermission = useAuthStore((s) => s.hasPermission)
  const location = useLocation()

  const code = getRoutePermissionCode(location.pathname)
  if (code && !hasPermission(code)) return <ForbiddenPage />

  return <Outlet />
}
