import { adminPermissions } from './permissions.admin'
import { hrmPermissions } from './permissions.hrm'
import { lmsPermissions } from './permissions.lms'

export const ROUTE_PERMISSION_CODES: Record<string, string> = {
  ...adminPermissions,
  ...hrmPermissions,
  ...lmsPermissions,
}

const SORTED_KEYS = Object.keys(ROUTE_PERMISSION_CODES).sort((a, b) => b.length - a.length)

export function getRoutePermissionCode(pathname: string): string | null {
  const key = SORTED_KEYS.find((k) => pathname.startsWith(k))
  return key ? ROUTE_PERMISSION_CODES[key] : null
}
