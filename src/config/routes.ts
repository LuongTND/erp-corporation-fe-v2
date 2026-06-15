// ──────────────────────────────────────────────────────────────
// Route Path Constants — Single Source of Truth
// ──────────────────────────────────────────────────────────────
// Tất cả URL paths khai báo ở đây, KHÔNG hardcode trong router.tsx.
// Khi cần đổi URL, chỉ sửa file này.

export const ROUTES = {
  // ── Public ──
  LANDING: '/',
  PORTAL: '/portal',
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
    EMPLOYEES: '/hr/employees',
    EMPLOYEE_DETAIL: '/hr/employees/:id',
    ATTENDANCE: '/hr/attendance',
    PAYROLL: '/hr/payroll',
    KPI: '/hr/kpi',
    LEAVE: '/hr/leave',
    ORG_CHART: '/hr/org-chart',
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
  },

  // ── Admin ──
  ADMIN: {
    ROOT: '/admin',
    ACCOUNTS: '/admin/accounts',
    SETTINGS: '/admin/settings',
    PERMISSIONS: '/admin/permissions',
  },
} as const

