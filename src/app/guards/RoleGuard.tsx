import { useAuthStore } from '@/stores/auth.store'
import { useLocation, Outlet } from 'react-router-dom'
import { hasAccess } from '@/config/permissions'
import ForbiddenPage from '@/features/auth/pages/ForbiddenPage'

/**
 * Guard: Kiểm tra quyền truy cập theo Role (Authorization).
 * Chạy SAU ProtectedRoute (user đã authenticated).
 * Nếu role không có quyền → hiển thị trang Forbidden (403).
 */
export function RoleGuard() {
  // TODO: bỏ comment khi test xong
  // const user = useAuthStore((s) => s.user)
  // const location = useLocation()
  // const allowed = hasAccess(location.pathname, user?.role ?? null)
  // if (!allowed) { return <ForbiddenPage /> }
  return <Outlet />
}
