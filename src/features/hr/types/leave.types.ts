export type LeaveType =
  | 'Annual Leave'
  | 'Sick Leave'
  | 'Maternity'
  | 'Paternity'
  | 'Unpaid Leave'
  | 'WFH'
  | 'Compassionate'

export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected' | 'Cancelled'

export interface LeaveEmployee {
  id: string
  name: string
  initials: string
  department: string
}

export interface LeaveRequest {
  id: string
  employee: LeaveEmployee
  type: LeaveType
  from: string
  to: string
  days: number
  reason: string
  appliedOn: string
  status: LeaveStatus
  actionedBy?: string
  actionedAt?: string
}

export interface EmployeeBalance {
  employeeId: string
  employeeName: string
  balances: Array<{
    type: LeaveType
    used: number
    total: number | null
    unlimited?: boolean
  }>
}
