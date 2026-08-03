// ──────────────────────────────────────────────────────────────
// Role-based Redirect sau khi đăng nhập thành công
// ──────────────────────────────────────────────────────────────

export const ROLE_REDIRECTS: Record<string, string> = {
  ROLE_SUPER_ADMIN: '/admin/permissions',
  ROLE_HR_ADMIN: '/hr',
  ROLE_EMPLOYEE: '/dashboard',
  customer: '/customer/nguyen-lieu',
  // DB role names (case variants from seeded data)
  Admin: '/admin/permissions',
  admin: '/admin/permissions',
  Employee: '/dashboard',
  HRAdmin: '/hr',
}
