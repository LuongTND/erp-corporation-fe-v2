/**
 * Post-login redirect by role name (from BE profile.role).
 * Roles are dynamic — only the seeded Admin role is listed here.
 * All other roles default to /dashboard.
 */
export const ROLE_REDIRECTS: Record<string, string> = {
  Admin: '/admin/permissions',
}
