import { useAuthStore } from '@/stores/auth.store'
import { Navigate, Outlet } from 'react-router-dom'
import { ROUTES } from '@/config/routes'

/**
 * Guard: Chỉ cho vào nếu đã đăng nhập.
 * Nếu chưa → redirect về Portal.
 */
export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return isAuthenticated ? <Outlet /> : <Navigate to={ROUTES.PORTAL} replace />
}
