import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'

import { ROUTES } from '@/config/routes'
import { ProtectedRoute, PublicRoute, RoleGuard } from '@/app/guards'
import { PageFallback } from '@/components/common/PageFallback'

// ── Eager imports (nhẹ, cần ngay) ──
import LandingPage from '@/features/landing/pages/LandingPage'
import LoginPage from '@/features/auth/pages/LoginPage'
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

// ── Admin Module ──
const AdminRolesPage = lazy(() => import('@/features/admin/pages/RolesPage'))
const AdminDepartmentsPage = lazy(() => import('@/features/admin/pages/DepartmentsPage'))
const AdminJobLevelsPage = lazy(() => import('@/features/admin/pages/JobLevelsPage'))
const AdminDepartmentJobLevelsPage = lazy(() => import('@/features/admin/pages/DepartmentJobLevelsPage'))
const AdminEmployeesPage = lazy(() => import('@/features/admin/pages/EmployeesPage'))
const AdminCustomFieldsPage = lazy(() => import('@/features/admin/pages/CustomFieldsPage'))
const AdminEmployeeTypesPage = lazy(() => import('@/features/admin/pages/EmployeeTypesPage'))
const AdminStoresPage = lazy(() => import('@/features/admin/pages/StoresPage'))
const AdminRegionsPage = lazy(() => import('@/features/admin/pages/RegionsPage'))
const AdminCountersPage = lazy(() => import('@/features/admin/pages/CountersPage'))
const AdminKpiPayrollPage = lazy(() => import('@/features/admin/pages/KpiPayrollPage'))
const AdminPayrollRunDetailPage = lazy(() => import('@/features/admin/pages/PayrollRunDetailPage'))
const AdminAuditLogsPage = lazy(() => import('@/features/admin/pages/AuditLogsPage'))
const AdminContractsPage = lazy(() => import('@/features/admin/pages/ContractsPage'))
const AdminContractTemplatesPage = lazy(() => import('@/features/admin/pages/ContractTemplatesPage'))
const AdminLabelsPage = lazy(() => import('@/features/admin/pages/LabelsPage'))
const AdminRecruitmentApproverConfigsPage = lazy(() => import('@/features/admin/pages/RecruitmentApproverConfigsPage'))
const AdminProfileComponentsPage = lazy(() => import('@/features/admin/pages/ProfileComponentsPage'))
const HRManagerContractsPage = lazy(() => import('@/features/admin/pages/HRManagerContractsPage'))
const StoreManagerPortalPage = lazy(() => import('@/features/store-manager/pages/StoreManagerPortalPage'))
const MyProfilePage = lazy(() => import('@/features/hr/pages/MyProfilePage'))
const RecruitmentRequestsPage = lazy(() => import('@/features/hr/pages/RecruitmentRequestsPage'))
const RecruitmentRequestDetailPage = lazy(() => import('@/features/hr/pages/RecruitmentRequestDetailPage'))
const CandidatesListPage = lazy(() => import('@/features/hr/pages/CandidatesListPage'))
const JobPostingsPage = lazy(() => import('@/features/hr/pages/JobPostingsPage'))

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

              // ── Recruitment Module ──
              {
                path: ROUTES.HR.RECRUITMENT,
                element: (
                  <Suspense fallback={<PageFallback />}>
                    <RecruitmentRequestsPage />
                  </Suspense>
                ),
              },
              {
                path: ROUTES.HR.RECRUITMENT_DETAIL,
                element: (
                  <Suspense fallback={<PageFallback />}>
                    <RecruitmentRequestDetailPage />
                  </Suspense>
                ),
              },

              {
                path: ROUTES.HR.CANDIDATES,
                element: (
                  <Suspense fallback={<PageFallback />}>
                    <CandidatesListPage />
                  </Suspense>
                ),
              },
              {
                path: ROUTES.HR.JOB_POSTINGS,
                element: (
                  <Suspense fallback={<PageFallback />}>
                    <JobPostingsPage />
                  </Suspense>
                ),
              },

              // ── HR Manager Module ──
              {
                path: ROUTES.HR_MANAGER.CONTRACTS,
                element: (
                  <Suspense fallback={<PageFallback />}>
                    <HRManagerContractsPage />
                  </Suspense>
                ),
              },

              // ── Admin Module ──
              {
                path: ROUTES.ADMIN.ROLES,
                element: (
                  <Suspense fallback={<PageFallback />}>
                    <AdminRolesPage />
                  </Suspense>
                ),
              },
              // ponytail: Quyền hạn merged into Vai trò tab
              {
                path: ROUTES.ADMIN.DEPARTMENTS,
                element: (
                  <Suspense fallback={<PageFallback />}>
                    <AdminDepartmentsPage />
                  </Suspense>
                ),
              },
              {
                path: ROUTES.ADMIN.JOB_LEVELS,
                element: (
                  <Suspense fallback={<PageFallback />}>
                    <AdminJobLevelsPage />
                  </Suspense>
                ),
              },
              {
                path: ROUTES.ADMIN.DEPARTMENT_JOB_LEVELS,
                element: (
                  <Suspense fallback={<PageFallback />}>
                    <AdminDepartmentJobLevelsPage />
                  </Suspense>
                ),
              },
              {
                path: ROUTES.ADMIN.EMPLOYEE_TYPES,
                element: (
                  <Suspense fallback={<PageFallback />}>
                    <AdminEmployeeTypesPage />
                  </Suspense>
                ),
              },
              {
                path: ROUTES.ADMIN.STORES,
                element: (
                  <Suspense fallback={<PageFallback />}>
                    <AdminStoresPage />
                  </Suspense>
                ),
              },
              {
                path: ROUTES.ADMIN.REGIONS,
                element: (
                  <Suspense fallback={<PageFallback />}>
                    <AdminRegionsPage />
                  </Suspense>
                ),
              },
              {
                path: ROUTES.ADMIN.COUNTERS,
                element: (
                  <Suspense fallback={<PageFallback />}>
                    <AdminCountersPage />
                  </Suspense>
                ),
              },
              {
                path: ROUTES.ADMIN.AUDIT_LOGS,
                element: (
                  <Suspense fallback={<PageFallback />}>
                    <AdminAuditLogsPage />
                  </Suspense>
                ),
              },
              {
                path: ROUTES.ADMIN.CONTRACTS,
                element: (
                  <Suspense fallback={<PageFallback />}>
                    <AdminContractsPage />
                  </Suspense>
                ),
              },
              {
                path: ROUTES.ADMIN.CONTRACT_TEMPLATES,
                element: (
                  <Suspense fallback={<PageFallback />}>
                    <AdminContractTemplatesPage />
                  </Suspense>
                ),
              },
              {
                path: ROUTES.ADMIN.LABELS,
                element: (
                  <Suspense fallback={<PageFallback />}>
                    <AdminLabelsPage />
                  </Suspense>
                ),
              },
              {
                path: ROUTES.ADMIN.RECRUITMENT_APPROVER_CONFIGS,
                element: (
                  <Suspense fallback={<PageFallback />}>
                    <AdminRecruitmentApproverConfigsPage />
                  </Suspense>
                ),
              },
              {
                path: ROUTES.ADMIN.EMPLOYEES,
                element: (
                  <Suspense fallback={<PageFallback />}>
                    <AdminEmployeesPage />
                  </Suspense>
                ),
              },
              {
                path: ROUTES.ADMIN.EMPLOYEE_DETAIL,
                element: (
                  <Suspense fallback={<PageFallback />}>
                    <EmployeeDetailPage />
                  </Suspense>
                ),
              },
              {
                path: ROUTES.ADMIN.CUSTOM_FIELDS,
                element: (
                  <Suspense fallback={<PageFallback />}>
                    <AdminCustomFieldsPage />
                  </Suspense>
                ),
              },
              {
                path: ROUTES.ADMIN.PROFILE_COMPONENTS,
                element: (
                  <Suspense fallback={<PageFallback />}>
                    <AdminProfileComponentsPage />
                  </Suspense>
                ),
              },
              {
                path: ROUTES.ADMIN.KPI_ENTRIES,
                element: (
                  <Suspense fallback={<PageFallback />}>
                    <AdminKpiPayrollPage />
                  </Suspense>
                ),
              },
              {
                path: ROUTES.ADMIN.PAYROLL_RUNS,
                element: (
                  <Suspense fallback={<PageFallback />}>
                    <AdminKpiPayrollPage />
                  </Suspense>
                ),
              },
              {
                path: ROUTES.ADMIN.PAYROLL_RUN_DETAIL,
                element: (
                  <Suspense fallback={<PageFallback />}>
                    <AdminPayrollRunDetailPage />
                  </Suspense>
                ),
              },
              // ponytail: hidden — hardcoded data, re-enable when backend supports parentRoleId
              // {
              //   path: ROUTES.ADMIN.ROLE_HIERARCHY,
              //   element: (
              //     <Suspense fallback={<PageFallback />}>
              //       <AdminRoleHierarchyPage />
              //     </Suspense>
              //   ),
              // },
              // ponytail: Cơ cấu tổ chức merged into Phòng ban tab

              // ── My Profile (NV self) ──
              {
                path: ROUTES.PROFILE,
                element: (
                  <Suspense fallback={<PageFallback />}>
                    <MyProfilePage />
                  </Suspense>
                ),
              },

              // ── Store Manager Portal ──
              {
                path: ROUTES.STORE_MANAGER,
                element: (
                  <Suspense fallback={<PageFallback />}>
                    <StoreManagerPortalPage />
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
