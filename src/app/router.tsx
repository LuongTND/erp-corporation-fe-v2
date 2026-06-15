import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'

import { ROUTES } from '@/config/routes'
import { ProtectedRoute, PublicRoute, RoleGuard } from '@/app/guards'
import { PageFallback } from '@/components/common/PageFallback'

// ── Eager imports (nhẹ, cần ngay) ──
import LandingPage from '@/features/landing/pages/LandingPage'
import LoginPage from '@/features/auth/pages/LoginPage'
import PortalPage from '@/features/auth/pages/PortalPage'
import ForbiddenPage from '@/features/auth/pages/ForbiddenPage'

// ── Lazy imports (nặng, load khi cần) ──
const AppLayout = lazy(() => import('@/components/layout/AppLayout'))
const AuthLayout = lazy(() => import('@/components/layout/AuthLayout'))
const ChatPage = lazy(() => import('@/features/chat-2/pages/ChatPage'))
const TaskPage = lazy(() => import('@/features/task/pages/TaskPage'))

// ──────────────────────────────────────────────────────────────
// Router — Chỉ chứa Route Tree
// ──────────────────────────────────────────────────────────────
// Guard: chỉ cho vào nếu đã đăng nhập
// function ProtectedRoute() {
//   return <Outlet />
// }

// const PageFallback = () => (
//   <div className="flex h-screen items-center justify-center">
//     <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
//   </div>
// )

export const router = createBrowserRouter([
  // ── Landing (public) ──
  {
    path: ROUTES.LANDING,
    element: <LandingPage />,
  },

  // ── Auth routes (public only — redirect if already logged in) ──
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
          { path: ROUTES.PORTAL, element: <PortalPage /> },
          { path: ROUTES.LOGIN, element: <LoginPage /> },
        ],
      },
    ],
  },

  // ── Forbidden (standalone) ──
  {
    path: ROUTES.FORBIDDEN,
    element: <ForbiddenPage />,
  },

  // ── Protected routes (authenticated + role-checked) ──
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
              { path: ROUTES.DASHBOARD, element: <LandingPage /> },
              { path: ROUTES.CHAT, element: <ChatPage /> },
              { path: ROUTES.TASK, element: <TaskPage /> },
            ],
          },
        ],
      },
    ],
  },
])
