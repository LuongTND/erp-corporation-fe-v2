import { P } from '../permissionCodes'

export const adminPermissions: Record<string, string> = {
  '/admin/permissions': P.ROLES_VIEW,
  '/admin/role-hierarchy': P.ROLES_VIEW,
  '/admin/accounts': P.USERS_VIEW,
  '/admin/org-hierarchy': P.DEPARTMENTS_VIEW,
  '/admin/settings': P.ROLES_VIEW,
  '/admin': P.ROLES_VIEW,
}
