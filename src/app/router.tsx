import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth.store'

// Layouts
const AppLayout = lazy(() => import('@/components/layout/AppLayout'))
const AuthLayout = lazy(() => import('@/components/layout/AuthLayout'))

// Pages — lazy load theo từng module để tối ưu bundle
const LandingPage = lazy(() => import('@/features/landing/pages/LandingPage'))
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'))
const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage'))
const InventoryPage = lazy(() => import('@/features/inventory/pages/InventoryPage'))
const CrmPage = lazy(() => import('@/features/crm/pages/CrmPage'))
const ManufacturingPage = lazy(() => import('@/features/manufacturing/pages/ManufacturingPage'))
const AccountingPage = lazy(() => import('@/features/accounting/pages/AccountingPage'))
const HrPage = lazy(() => import('@/features/hr/pages/HrPage'))

// Guard: chỉ cho vào nếu đã đăng nhập
function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
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
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/inventory/*', element: <InventoryPage /> },
          { path: '/crm/*', element: <CrmPage /> },
          { path: '/manufacturing/*', element: <ManufacturingPage /> },
          { path: '/accounting/*', element: <AccountingPage /> },
          { path: '/hr/*', element: <HrPage /> },
        ],
      },
    ],
  },
])
