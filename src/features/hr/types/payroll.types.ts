export type PayrollStatus = 'Draft' | 'Finalized' | 'Processing'
export type EmployeePayStatus = 'Paid' | 'Pending' | 'Error'

export interface PayrollEmployee {
  id: string
  name: string
  initials: string
  department: string
  position: string
  bankAccount: string
  baseSalary: number
  allowances: number
  overtime: number
  bonus: number
  deductions: {
    socialInsurance: number
    healthInsurance: number
    pit: number
    other: number
  }
  netPay: number
  status: EmployeePayStatus
}

export interface DeptPayrollData {
  dept: string
  baseSalary: number
  allowances: number
  overtime: number
  bonus: number
}

export interface PayrollRun {
  id: string
  period: string
  totalEmployees: number
  totalNetPay: number
  runBy: string
  runDate: string
  status: PayrollStatus
}
