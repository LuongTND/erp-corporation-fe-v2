// ──────────────────────────────────────────────────────────────
// Role Definitions — Phù hợp với backend .NET Identity
// ──────────────────────────────────────────────────────────────

export const ROLES = {
  SUPER_ADMIN: 'ROLE_SUPER_ADMIN',
  HR_ADMIN: 'ROLE_HR_ADMIN',
  EMPLOYEE: 'ROLE_EMPLOYEE',
  CUSTOMER: 'customer', // ponytail: no BE backing yet, keep until customer portal is defined
} as const

export type UserRole = (typeof ROLES)[keyof typeof ROLES]

export const ROLE_VALUES = Object.values(ROLES) as [UserRole, ...UserRole[]]

// Microsoft Identity Claims key dùng để decode role từ JWT
export const MICROSOFT_ROLE_CLAIM =
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
