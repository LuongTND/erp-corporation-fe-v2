import { ROLES, type UserRole } from './roles'

// ──────────────────────────────────────────────────────────────
// 1. Role Groups — Nhóm quyền dùng chung
// ──────────────────────────────────────────────────────────────

export const ROLE_GROUPS = {
  /** Tất cả roles nội bộ */
  ALL: [ROLES.SUPER_ADMIN, ROLES.HR_ADMIN, ROLES.EMPLOYEE] as UserRole[],

  /** Nhân sự nội bộ (trừ Super Admin) */
  INTERNAL: [ROLES.HR_ADMIN, ROLES.EMPLOYEE] as UserRole[],

  /** HR Admin trở lên */
  MANAGEMENT: [ROLES.HR_ADMIN, ROLES.SUPER_ADMIN] as UserRole[],

  /** Vận hành */
  OPS: [ROLES.HR_ADMIN, ROLES.EMPLOYEE] as UserRole[],

  /** Chỉ Super Admin */
  ADMIN_ONLY: [ROLES.SUPER_ADMIN] as UserRole[],

  /** Super Admin */
  HIGH_LEVEL: [ROLES.SUPER_ADMIN] as UserRole[],
} as const

// ──────────────────────────────────────────────────────────────
// 2. Route Permission Config
// ──────────────────────────────────────────────────────────────

export interface RoutePermission {
  roles: UserRole[]
  isPublic?: boolean
}

/**
 * Bản đồ quyền truy cập cho từng route.
 * Key là path prefix, value là config quyền.
 * Sắp xếp từ cụ thể → tổng quát.
 */
export const PERMISSION_MAP: Record<string, RoutePermission> = {
  // ── Public Routes ──
  '/login': { roles: [], isPublic: true },
  '/portal': { roles: [], isPublic: true },

  // ── Shared Routes (Tất cả roles) ──
  '/dashboard': { roles: ROLE_GROUPS.ALL },
  '/chat': { roles: ROLE_GROUPS.ALL },
  '/task': { roles: ROLE_GROUPS.ALL },
  '/employee': { roles: ROLE_GROUPS.ALL },

  // ── Customer Portal (Khách hàng) ──
  '/customer': { roles: [ROLES.CUSTOMER] },

  // ── Admin Only ──
  '/admin/accounts': { roles: ROLE_GROUPS.ADMIN_ONLY },
  '/admin/settings': { roles: ROLE_GROUPS.ADMIN_ONLY },
  '/admin/permissions': { roles: ROLE_GROUPS.ADMIN_ONLY },
  '/admin/role-hierarchy': { roles: ROLE_GROUPS.ADMIN_ONLY },
  '/admin/org-hierarchy': { roles: ROLE_GROUPS.MANAGEMENT },
  '/admin': { roles: ROLE_GROUPS.HIGH_LEVEL },
}

// Pre-sort keys by length descending for prefix matching
const SORTED_PERMISSION_KEYS = Object.keys(PERMISSION_MAP).sort(
  (a, b) => b.length - a.length,
)

// ──────────────────────────────────────────────────────────────
// 3. Utility Functions
// ──────────────────────────────────────────────────────────────

/**
 * Lấy config quyền cho một pathname cụ thể.
 * Match theo prefix (path dài nhất match trước).
 */
export function getRoutePermission(pathname: string): RoutePermission | null {
  if (pathname === '/' && PERMISSION_MAP['/']) {
    return PERMISSION_MAP['/']
  }
  const matchedKey = SORTED_PERMISSION_KEYS.find((key) =>
    pathname.startsWith(key),
  )
  return matchedKey ? PERMISSION_MAP[matchedKey] : null
}

/**
 * Kiểm tra user có quyền truy cập route hay không.
 *
 * @param pathname - Đường dẫn hiện tại
 * @param userRole - Role của user (null nếu chưa login)
 * @returns true nếu được phép, false nếu bị chặn
 */
export function hasAccess(pathname: string, userRole: string | null): boolean {
  const config = getRoutePermission(pathname)

  // Route không được định nghĩa → cho phép (để ProtectedRoute xử lý auth)
  if (!config) return true

  // Public route → luôn cho phép
  if (config.isPublic) return true

  // Chưa login → chặn
  if (!userRole) return false

  // Check role
  return config.roles.includes(userRole as UserRole)
}
