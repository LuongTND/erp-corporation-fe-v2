import LoginPage from '@/features/auth/pages/LoginPage'
import LandingPage from '@/features/landing/pages/LandingPage'
import { useAuthStore } from '@/stores/auth.store'
import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'

// Layouts
const AppLayout = lazy(() => import('@/components/layout/AppLayout'))
const AuthLayout = lazy(() => import('@/components/layout/AuthLayout'))

// Pages — lazy load theo từng module để tối ưu bundle
const ChatPage = lazy(() => import('@/features/chat/pages/ChatPage'))
const TaskPage = lazy(() => import('@/features/task/pages/TaskPage'))

// Guard: chỉ cho vào nếu đã đăng nhập
function ProtectedRoute() {
  // const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  // return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
  return <Outlet /> // DEV ONLY: bypass auth
}

const PageFallback = () => (
  <div className="flex h-screen items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
  </div>
)

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
  // Auth routes
  {
    element: (
      <Suspense fallback={<PageFallback />}>
        <AuthLayout />
      </Suspense>
    ),
    children: [{ path: '/login', element: <LoginPage /> }],
  },
  // Protected app routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: (
          <Suspense fallback={<PageFallback />}>
            <AppLayout />
          </Suspense>
        ),
        children: [
          { path: '/', element: <Navigate to="/dashboard" replace /> },
          { path: '/chat', element: <ChatPage /> },
          { path: '/task', element: <TaskPage /> },
        ],
      },
    ],
  },
])
