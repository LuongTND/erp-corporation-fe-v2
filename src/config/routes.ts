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
  EMPLOYEE: '/employee',

  // ── Admin ──
  ADMIN: {
    ROOT: '/admin',
    ACCOUNTS: '/admin/accounts',
    SETTINGS: '/admin/settings',
    PERMISSIONS: '/admin/permissions',
  },
} as const
