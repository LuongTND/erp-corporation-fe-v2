import { useAuthStore } from '@/stores/auth.store'
import { Navigate, Outlet } from 'react-router-dom'
import { ROUTES } from '@/config/routes'

/**
 * Guard: Chỉ cho vào nếu CHƯA đăng nhập (dành cho login/portal).
 * Nếu đã login → redirect về Dashboard.
 */
export function PublicRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return !isAuthenticated ? <Outlet /> : <Navigate to={ROUTES.DASHBOARD} replace />
}
