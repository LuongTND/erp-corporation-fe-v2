export interface QueryResult<T> {
  items: T[]
  totalCount: number
}

export interface RoleResponse {
  id: string
  roleName: string
  description?: string
  isSystemRole: boolean
  isActive: boolean
}

export interface PermissionResponse {
  id: string
  permissionCode: string
  isActive: boolean
}

export interface DepartmentResponse {
  id: string
  departmentName: string
  departmentCode: string
  parentDepartmentId?: string
  parentDepartmentName?: string
  isActive: boolean
}

export interface JobLevelResponse {
  id: string
  levelName: string
  levelOrder: number
  defaultScopeType: ScopeType
  description?: string
  baseSalaryMin?: number
  baseSalaryMax?: number
  isDeleted: boolean
}

export type ScopeType = 1 | 2 | 3 | 4

export const SCOPE_TYPE_LABELS = {
  1: 'Own',
  2: 'Team',
  3: 'Department',
  4: 'All',
} as const satisfies Record<ScopeType, string>

// PascalCase to match BE QueryInfo model
export interface ListParams {
  Top?: number
  Skip?: number
  SearchText?: string
  IsActive?: boolean
  NeedTotalCount?: boolean
}
