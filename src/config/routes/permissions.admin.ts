import { P } from '../permissionCodes'

export const adminPermissions: Record<string, string> = {
  '/admin/permissions': P.PERMISSIONS_VIEW,
  '/admin/role-hierarchy': P.ROLES_VIEW,
  '/admin/accounts': P.ROLES_VIEW,
  '/admin/employees': P.USERS_VIEW,
  '/admin/org-hierarchy': P.DEPARTMENTS_VIEW,
  '/admin/settings': P.ROLES_VIEW,
  '/admin': P.ROLES_VIEW,
}
