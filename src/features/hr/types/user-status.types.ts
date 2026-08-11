export const USER_STATUS = {
  Active: 'Active',
  Probation: 'Probation',
  Resigned: 'Resigned',
  Terminated: 'Terminated',
  Suspended: 'Suspended',
  MaternityLeave: 'MaternityLeave',
  Apprentice: 'Apprentice',
  Official: 'Official',
} as const

export type UserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS]

export const USER_STATUS_LABEL: Record<UserStatus, string> = {
  Active: 'Đang làm việc',
  Probation: 'Thử việc',
  Resigned: 'Nghỉ việc',
  Terminated: 'Chấm dứt HĐ',
  Suspended: 'Tạm nghỉ',
  MaternityLeave: 'Nghỉ thai sản',
  Apprentice: 'Học việc',
  Official: 'Chính thức',
}

export interface UserStatusHistoryItem {
  changedAt: string
  oldStatus: UserStatus
  newStatus: UserStatus
  note: string | null
  changedBy: string | null
}
