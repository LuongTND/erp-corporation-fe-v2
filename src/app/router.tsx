import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'

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

// Pages — lazy load theo từng module để tối ưu bundle
const HRMDashboardPage = lazy(() => import('@/features/hr/pages/HRMDashboardPage'))
const EmployeeListPage = lazy(() => import('@/features/hr/pages/EmployeeListPage'))
const EmployeeDetailPage = lazy(() => import('@/features/hr/pages/EmployeeDetailPage'))
const ChatPage = lazy(() => import('@/features/chat-2/pages/ChatPage'))
const TaskPage = lazy(() => import('@/features/task/pages/TaskPage'))
const TaskDetailPage = lazy(() => import('@/features/task/pages/TaskDetailPage'))
const LMSDashboardPage = lazy(() => import('@/features/lms/pages/LMSDashboardPage'))
const LMSCatalogPage = lazy(() => import('@/features/lms/pages/LMSCatalogPage'))
const CourseDetailPage = lazy(() => import('@/features/lms/pages/CourseDetailPage'))
const LessonPlayerPage = lazy(() => import('@/features/lms/pages/LessonPlayerPage'))
const QuizPage = lazy(() => import('@/features/lms/pages/QuizPage'))
const LearnerProgressPage = lazy(() => import('@/features/lms/pages/LearnerProgressPage'))
const AttendancePage = lazy(() => import('@/features/hr/pages/AttendancePage'))
const PayrollPage = lazy(() => import('@/features/hr/pages/PayrollPage'))
const KpiPage   = lazy(() => import('@/features/hr/pages/KpiPage'))
const LeavePage    = lazy(() => import('@/features/hr/pages/LeavePage'))
const OrgChartPage = lazy(() => import('@/features/hr/pages/OrgChartPage'))

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
      // Full-screen routes (no sidebar)
      {
        path: '/lms/course/:courseId/quiz/:quizId',
        element: (
          <Suspense fallback={<PageFallback />}>
            <QuizPage />
          </Suspense>
        ),
      },
      {
        path: '/lms/course/:courseId/lesson/:lessonId',
        element: (
          <Suspense fallback={<PageFallback />}>
            <LessonPlayerPage />
          </Suspense>
        ),
      },
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
          { path: '/', element: <Navigate to="/dashboard" replace /> },
          { path: '/hr', element: <Suspense fallback={<PageFallback />}><HRMDashboardPage /></Suspense> },
          { path: '/hr/employees', element: <Suspense fallback={<PageFallback />}><EmployeeListPage /></Suspense> },
          { path: '/hr/employees/:id', element: <Suspense fallback={<PageFallback />}><EmployeeDetailPage /></Suspense> },
          { path: '/hr/attendance', element: <Suspense fallback={<PageFallback />}><AttendancePage /></Suspense> },
          { path: '/hr/payroll',    element: <Suspense fallback={<PageFallback />}><PayrollPage /></Suspense> },
          { path: '/hr/kpi',       element: <Suspense fallback={<PageFallback />}><KpiPage /></Suspense> },
          { path: '/hr/leave',      element: <Suspense fallback={<PageFallback />}><LeavePage /></Suspense> },
          { path: '/hr/org-chart', element: <Suspense fallback={<PageFallback />}><OrgChartPage /></Suspense> },
          { path: '/chat', element: <ChatPage /> },
          { path: '/task', element: <TaskPage /> },
          { path: '/task/:id', element: <Suspense fallback={<PageFallback />}><TaskDetailPage /></Suspense> },
          { path: '/lms', element: <Suspense fallback={<PageFallback />}><LMSDashboardPage /></Suspense> },
          { path: '/lms/explore', element: <Suspense fallback={<PageFallback />}><LMSCatalogPage /></Suspense> },
          { path: '/lms/course/:id', element: <Suspense fallback={<PageFallback />}><CourseDetailPage /></Suspense> },
          { path: '/lms/course/:id/learn', element: <Suspense fallback={<PageFallback />}><LessonPlayerPage /></Suspense> },
          { path: '/lms/progress', element: <Suspense fallback={<PageFallback />}><LearnerProgressPage /></Suspense> },
        ],
      },
    ],
  },
])
