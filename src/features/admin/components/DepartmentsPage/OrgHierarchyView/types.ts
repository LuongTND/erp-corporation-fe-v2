import type { DepartmentTreeResponse } from '../../../types/admin.types'

export type JobLevelOption = { id: string; levelName: string }

export type DeptNode = DepartmentTreeResponse & { children: readonly DeptNode[] }
