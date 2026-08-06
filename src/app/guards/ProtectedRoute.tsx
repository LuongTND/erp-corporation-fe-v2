import { useAuthStore } from '@/stores/auth.store'
import { Navigate, Outlet } from 'react-router-dom'
import { ROUTES } from '@/config/routes'

export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return isAuthenticated ? <Outlet /> : <Navigate to={ROUTES.LOGIN} replace />
}
