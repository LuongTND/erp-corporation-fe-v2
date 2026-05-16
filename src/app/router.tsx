import LoginPage from '@/features/auth/pages/LoginPage'
import PortalPage from '@/features/auth/pages/PortalPage'
import ForbiddenPage from '@/features/auth/pages/ForbiddenPage'
import LandingPage from '@/features/landing/pages/LandingPage'
import { useAuthStore } from '@/stores/auth.store'
import { hasAccess } from '@/config/permissions'
import { lazy, Suspense } from 'react'
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  useLocation,
} from 'react-router-dom'

// Layouts
const AppLayout = lazy(() => import('@/components/layout/AppLayout'))
const AuthLayout = lazy(() => import('@/components/layout/AuthLayout'))

// Pages — lazy load theo từng module để tối ưu bundle
const ChatPage = lazy(() => import('@/features/chat/pages/ChatPage'))
const TaskPage = lazy(() => import('@/features/task/pages/TaskPage'))

// ──────────────────────────────────────────────────────────────
// Route Guards
// ──────────────────────────────────────────────────────────────

/**
 * Guard: Chỉ cho vào nếu đã đăng nhập.
 * Nếu chưa → redirect về /portal.
 */
function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return isAuthenticated ? <Outlet /> : <Navigate to="/portal" replace />
}

/**
 * Guard: Chỉ cho vào nếu CHƯA đăng nhập (dành cho login/portal).
 * Nếu đã login → redirect về /dashboard.
 */
function PublicRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return !isAuthenticated ? <Outlet /> : <Navigate to="/dashboard" replace />
}

/**
 * Guard: Kiểm tra quyền truy cập theo Role (Authorization).
 * Chạy SAU ProtectedRoute (user đã authenticated).
 * Nếu role không có quyền → hiển thị trang Forbidden (403).
 */
function RoleGuard() {
  const user = useAuthStore((s) => s.user)
  const location = useLocation()

  const allowed = hasAccess(location.pathname, user?.role ?? null)

  if (!allowed) {
    return <ForbiddenPage />
  }

  return <Outlet />
}

// ──────────────────────────────────────────────────────────────
// Fallback Loading
// ──────────────────────────────────────────────────────────────

const PageFallback = () => (
  <div className="flex h-screen items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
  </div>
)

// ──────────────────────────────────────────────────────────────
// Router
// ──────────────────────────────────────────────────────────────

export const router = createBrowserRouter([
  // Landing page (public)
  {
    path: '/',
    element: (
      <Suspense fallback={<PageFallback />}>
        <LandingPage />
      </Suspense>
    ),
  },

  // Auth routes (public only — redirect if already logged in)
  {
    element: <PublicRoute />,
    children: [
      {
        element: (
          <Suspense fallback={<PageFallback />}>
            <AuthLayout />
          </Suspense>
        ),
        children: [
          { path: '/portal', element: <PortalPage /> },
          { path: '/login', element: <LoginPage /> },
        ],
      },
    ],
  },

  // Forbidden page (accessible to anyone logged in)
  {
    path: '/forbidden',
    element: <ForbiddenPage />,
  },

  // Protected app routes (authenticated + role-checked)
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <RoleGuard />,
        children: [
          {
            element: (
              <Suspense fallback={<PageFallback />}>
                <AppLayout />
              </Suspense>
            ),
            children: [
              {
                path: '/dashboard',
                element: <div className="p-6">Dashboard (coming soon)</div>,
              },
              { path: '/chat', element: <ChatPage /> },
              { path: '/task', element: <TaskPage /> },
            ],
          },
        ],
      },
    ],
  },
])
