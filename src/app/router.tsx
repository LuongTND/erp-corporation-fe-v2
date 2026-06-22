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
import DashboardPage from '@/features/dashboard/pages/DashboardPage'

// ── Lazy imports (nặng, load khi cần) ──
const AppLayout = lazy(() => import('@/components/layout/AppLayout'))
const AuthLayout = lazy(() => import('@/components/layout/AuthLayout'))
const CustomerLayout = lazy(() => import('@/components/layout/CustomerLayout'))

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
const AdminCoursesPage = lazy(() => import('@/features/lms/pages/AdminCoursesPage'))
const AdminVideosPage = lazy(() => import('@/features/lms/pages/AdminVideosPage'))
const AdminWebinarsPage = lazy(() => import('@/features/lms/pages/AdminWebinarsPage'))
const AdminLearnersPage = lazy(() => import('@/features/lms/pages/AdminLearnersPage'))
const AdminAnalyticsPage = lazy(() => import('@/features/lms/pages/AdminAnalyticsPage'))
const AttendancePage = lazy(() => import('@/features/hr/pages/AttendancePage'))
const PayrollPage = lazy(() => import('@/features/hr/pages/PayrollPage'))
const KpiPage = lazy(() => import('@/features/hr/pages/KpiPage'))
const LeavePage = lazy(() => import('@/features/hr/pages/LeavePage'))
const OrgChartPage = lazy(() => import('@/features/hr/pages/OrgChartPage'))

// ── Customer Portal & Chatbot Pages ──
const CustomerCatalogPage = lazy(() => import('@/features/customer-portal/pages/CustomerCatalogPage'))
const CustomerProductDetailPage = lazy(() => import('@/features/customer-portal/pages/CustomerProductDetailPage'))
const CustomerCartPage = lazy(() => import('@/features/customer-portal/pages/CustomerCartPage'))
const CustomerLoyaltyPage = lazy(() => import('@/features/customer-portal/pages/CustomerLoyaltyPage'))
const CustomerOrdersPage = lazy(() => import('@/features/customer-portal/pages/CustomerOrdersPage'))
const CustomerOrderDetailPage = lazy(() => import('@/features/customer-portal/pages/CustomerOrderDetailPage'))
const CustomerPromotionsPage = lazy(() => import('@/features/customer-portal/pages/CustomerPromotionsPage'))
const AIChatbotPage = lazy(() => import('@/features/ai-chatbot/pages/AIChatbotPage'))

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
        path: ROUTES.LMS.QUIZ,
        element: (
          <Suspense fallback={<PageFallback />}>
            <QuizPage />
          </Suspense>
        ),
      },
      {
        path: ROUTES.LMS.LESSON,
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
          { path: '/', element: <Navigate to={ROUTES.DASHBOARD} replace /> },
          {
            element: (
              <Suspense fallback={<PageFallback />}>
                <AppLayout />
              </Suspense>
            ),
            children: [
              { path: ROUTES.DASHBOARD, element: <DashboardPage /> },
              { path: ROUTES.CHAT, element: <ChatPage /> },
              { path: ROUTES.TASK, element: <TaskPage /> },
              {
                path: ROUTES.TASK_DETAIL,
                element: (
                  <Suspense fallback={<PageFallback />}>
                    <TaskDetailPage />
                  </Suspense>
                ),
              },

              // ── HR & Payroll Module ──
              {
                path: ROUTES.HR.DASHBOARD,
                element: (
                  <Suspense fallback={<PageFallback />}>
                    <HRMDashboardPage />
                  </Suspense>
                ),
              },
              {
                path: ROUTES.HR.EMPLOYEES,
                element: (
                  <Suspense fallback={<PageFallback />}>
                    <EmployeeListPage />
                  </Suspense>
                ),
              },
              {
                path: ROUTES.HR.EMPLOYEE_DETAIL,
                element: (
                  <Suspense fallback={<PageFallback />}>
                    <EmployeeDetailPage />
                  </Suspense>
                ),
              },
              {
                path: ROUTES.HR.ATTENDANCE,
                element: (
                  <Suspense fallback={<PageFallback />}>
                    <AttendancePage />
                  </Suspense>
                ),
              },
              {
                path: ROUTES.HR.PAYROLL,
                element: (
                  <Suspense fallback={<PageFallback />}>
                    <PayrollPage />
                  </Suspense>
                ),
              },
              {
                path: ROUTES.HR.KPI,
                element: (
                  <Suspense fallback={<PageFallback />}>
                    <KpiPage />
                  </Suspense>
                ),
              },
              {
                path: ROUTES.HR.LEAVE,
                element: (
                  <Suspense fallback={<PageFallback />}>
                    <LeavePage />
                  </Suspense>
                ),
              },
              {
                path: ROUTES.HR.ORG_CHART,
                element: (
                  <Suspense fallback={<PageFallback />}>
                    <OrgChartPage />
                  </Suspense>
                ),
              },

              // ── LMS Module ──
              {
                path: ROUTES.LMS.DASHBOARD,
                element: (
                  <Suspense fallback={<PageFallback />}>
                    <LMSDashboardPage />
                  </Suspense>
                ),
              },
              {
                path: ROUTES.LMS.EXPLORE,
                element: (
                  <Suspense fallback={<PageFallback />}>
                    <LMSCatalogPage />
                  </Suspense>
                ),
              },
              {
                path: ROUTES.LMS.COURSE_DETAIL,
                element: (
                  <Suspense fallback={<PageFallback />}>
                    <CourseDetailPage />
                  </Suspense>
                ),
              },
              {
                path: ROUTES.LMS.COURSE_LEARN,
                element: (
                  <Suspense fallback={<PageFallback />}>
                    <LessonPlayerPage />
                  </Suspense>
                ),
              },
              {
                path: ROUTES.LMS.PROGRESS,
                element: (
                  <Suspense fallback={<PageFallback />}>
                    <LearnerProgressPage />
                  </Suspense>
                ),
              },

              // ── LMS Admin Module ──
              {
                path: ROUTES.LMS.ADMIN_COURSES,
                element: (
                  <Suspense fallback={<PageFallback />}>
                    <AdminCoursesPage />
                  </Suspense>
                ),
              },
              {
                path: ROUTES.LMS.ADMIN_VIDEOS,
                element: (
                  <Suspense fallback={<PageFallback />}>
                    <AdminVideosPage />
                  </Suspense>
                ),
              },
              {
                path: ROUTES.LMS.ADMIN_WEBINARS,
                element: (
                  <Suspense fallback={<PageFallback />}>
                    <AdminWebinarsPage />
                  </Suspense>
                ),
              },
              {
                path: ROUTES.LMS.ADMIN_LEARNERS,
                element: (
                  <Suspense fallback={<PageFallback />}>
                    <AdminLearnersPage />
                  </Suspense>
                ),
              },
              {
                path: ROUTES.LMS.ADMIN_ANALYTICS,
                element: (
                  <Suspense fallback={<PageFallback />}>
                    <AdminAnalyticsPage />
                  </Suspense>
                ),
              },
            ],
          },
          // ── CustomerLayout (External Customer Portal) ──
          {
            element: (
              <Suspense fallback={<PageFallback />}>
                <CustomerLayout />
              </Suspense>
            ),
            children: [
              {
                path: '/customer',
                element: <Navigate to={ROUTES.CUSTOMER_PORTAL.CATALOG} replace />,
              },
              {
                path: ROUTES.CUSTOMER_PORTAL.DASHBOARD,
                element: <Navigate to={ROUTES.CUSTOMER_PORTAL.CATALOG} replace />,
              },
              {
                path: ROUTES.CUSTOMER_PORTAL.CATALOG,
                element: (
                  <Suspense fallback={<PageFallback />}>
                    <CustomerCatalogPage />
                  </Suspense>
                ),
              },
              {
                path: ROUTES.CUSTOMER_PORTAL.PRODUCT_DETAIL,
                element: (
                  <Suspense fallback={<PageFallback />}>
                    <CustomerProductDetailPage />
                  </Suspense>
                ),
              },
              {
                path: ROUTES.CUSTOMER_PORTAL.CART,
                element: (
                  <Suspense fallback={<PageFallback />}>
                    <CustomerCartPage />
                  </Suspense>
                ),
              },
              {
                path: ROUTES.CUSTOMER_PORTAL.ORDERS,
                element: (
                  <Suspense fallback={<PageFallback />}>
                    <CustomerOrdersPage />
                  </Suspense>
                ),
              },
              {
                path: `${ROUTES.CUSTOMER_PORTAL.ORDERS}/:id`,
                element: (
                  <Suspense fallback={<PageFallback />}>
                    <CustomerOrderDetailPage />
                  </Suspense>
                ),
              },
              {
                path: ROUTES.CUSTOMER_PORTAL.LOYALTY,
                element: (
                  <Suspense fallback={<PageFallback />}>
                    <CustomerLoyaltyPage />
                  </Suspense>
                ),
              },
              {
                path: ROUTES.CUSTOMER_PORTAL.PROMOTIONS,
                element: (
                  <Suspense fallback={<PageFallback />}>
                    <CustomerPromotionsPage />
                  </Suspense>
                ),
              },
              {
                path: ROUTES.CUSTOMER_PORTAL.AI_CHATBOT,
                element: (
                  <Suspense fallback={<PageFallback />}>
                    <AIChatbotPage />
                  </Suspense>
                ),
              },
            ],
          },
        ],
      },
    ],
  },
])
