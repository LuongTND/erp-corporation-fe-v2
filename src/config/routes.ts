// ──────────────────────────────────────────────────────────────
// Route Path Constants — Single Source of Truth
// ──────────────────────────────────────────────────────────────
// Tất cả URL paths khai báo ở đây, KHÔNG hardcode trong router.tsx.
// Khi cần đổi URL, chỉ sửa file này.

export const ROUTES = {
  // ── Public ──
  LANDING: '/',
  LOGIN: '/login',
  FORBIDDEN: '/forbidden',

  // ── Protected ──
  DASHBOARD: '/dashboard',
  CHAT: '/chat',
  TASK: '/task',
  TASK_DETAIL: '/task/:id',
  EMPLOYEE: '/employee',

  // ── HR & Payroll ──
  HR: {
    DASHBOARD: '/hr',
    EMPLOYEES: '/employees',
    EMPLOYEE_DETAIL: '/employees/:id',
    ATTENDANCE: '/attendance',
    PAYROLL: '/payroll',
    KPI: '/kpi',
    LEAVE: '/leave',
    ORG_CHART: '/org-chart',
    RECRUITMENT: '/recruitment',
    RECRUITMENT_DETAIL: '/recruitment/:id',
    CANDIDATES: '/recruitment/candidates',
    CANDIDATE_DETAIL: '/recruitment/candidates/:id',
    JOB_POSTINGS: '/recruitment/job-postings',
  },

  // ── LMS ──
  LMS: {
    DASHBOARD: '/lms',
    EXPLORE: '/lms/explore',
    COURSE_DETAIL: '/lms/course/:id',
    COURSE_LEARN: '/lms/course/:id/learn',
    PROGRESS: '/lms/progress',
    QUIZ: '/lms/course/:courseId/quiz/:quizId',
    LESSON: '/lms/course/:courseId/lesson/:lessonId',
    // ── LMS Admin ──
    ADMIN_COURSES: '/lms/admin/courses',
    ADMIN_VIDEOS: '/lms/admin/videos',
    ADMIN_WEBINARS: '/lms/admin/webinars',
    ADMIN_LEARNERS: '/lms/admin/learners',
    ADMIN_ANALYTICS: '/lms/admin/analytics',
  },

  // ── Customer Portal ──
  CUSTOMER_PORTAL: {
    DASHBOARD: '/customer/dashboard',
    CATALOG: '/customer/nguyen-lieu',
    PRODUCT_DETAIL: '/customer/nguyen-lieu/:id',
    CART: '/customer/gio-hang',
    ORDERS: '/customer/orders',
    LOYALTY: '/customer/loyalty',
    PROMOTIONS: '/customer/promotions',
    AI_CHATBOT: '/customer/chatbot',
  },

  // ── My Profile (NV self) ──
  PROFILE: '/me',

  // ── Store Manager Portal ──
  STORE_MANAGER: '/store-manager',

  // ── Admin ──
  ADMIN: {
    ROOT: '/admin',
    ROLES: '/admin/roles',
    SETTINGS: '/admin/settings',
    PERMISSIONS: '/admin/permissions',
    DEPARTMENTS: '/admin/departments',
    JOB_LEVELS: '/admin/job-levels',
    DEPARTMENT_JOB_LEVELS: '/admin/department-job-levels',
    EMPLOYEES: '/admin/employees',
    EMPLOYEE_DETAIL: '/admin/employees/:id',
    ROLE_HIERARCHY: '/admin/role-hierarchy',
    ORG_HIERARCHY: '/admin/org-hierarchy',
    CUSTOM_FIELDS: '/admin/custom-fields',
    PROFILE_COMPONENTS: '/admin/profile-components',
    KPI_ENTRIES: '/admin/kpi-entries',
    PAYROLL_RUNS: '/admin/payroll-runs',
    PAYROLL_RUN_DETAIL: '/admin/payroll-runs/:id',
    EMPLOYEE_TYPES: '/admin/employee-types',
    STORES: '/admin/stores',
    REGIONS: '/admin/regions',
    COUNTERS: '/admin/counters',
    AUDIT_LOGS: '/admin/audit-logs',
    CONTRACTS: '/admin/contracts',
    CONTRACT_TEMPLATES: '/admin/contract-templates',
    LABELS: '/admin/labels',
    RECRUITMENT_APPROVER_CONFIGS: '/admin/recruitment-approver-configs',
    INTERVIEW_RULE_CONFIGS: '/admin/interview-rule-configs',
  },

  // ── HR Manager ──
  HR_MANAGER: {
    CONTRACTS: '/contracts',
  },
} as const


