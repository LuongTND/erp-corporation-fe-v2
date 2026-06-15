export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract'
export type WorkLocation = 'HQ' | 'Remote' | 'Hybrid'
export type ProbationStatus = 'Completed' | 'In Progress' | 'Not Applicable'
export type SystemRole = 'Admin' | 'HR Manager' | 'Employee'
export type AttendanceStatus = 'Present' | 'Late' | 'Absent' | 'Leave' | 'Weekend'
export type PayrollStatus = 'Paid' | 'Processing'
export type KPIStatus = 'Achieved' | 'In Progress' | 'Missed'
export type ActivityType = 'edit' | 'approved' | 'leave' | 'warning'

export interface EmergencyContact {
  name: string
  relationship: string
  phone: string
}

export interface BankAccount {
  bankName: string
  accountNumberMasked: string
}

export interface ITEquipment {
  id: string
  name: string
  serialNumber: string
  assignedDate: string
}

export interface Manager {
  id: string
  name: string
  initials: string
  avatarUrl?: string
}

export interface EmployeeDetail {
  id: string
  fullName: string
  position: string
  department: string
  employmentType: EmploymentType
  employeeCode: string
  joinDate: string
  avatarUrl?: string
  initials: string
  isOnline: boolean
  dateOfBirth: string
  gender: string
  nationality: string
  personalEmail: string
  personalPhone: string
  idNumber: string
  idExpiry: string
  permanentAddress: string
  emergencyContact: EmergencyContact
  bankAccount: BankAccount
  socialInsuranceNumber: string
  taxCode: string
  manager: Manager
  workLocation: WorkLocation
  workSchedule: string
  contractType: string
  contractEndDate: string
  daysUntilContractExpiry?: number
  salaryGrade: string
  salaryRange: string
  probationStatus: ProbationStatus
  probationEndDate?: string
  itEquipment: ITEquipment[]
  systemRoles: SystemRole[]
}

export interface AttendanceRecord {
  date: string
  checkIn: string
  checkOut: string
  hours: string
  status: AttendanceStatus
  note: string
}

export interface PayrollRecord {
  month: string
  gross: number
  deductions: number
  netPay: number
  status: PayrollStatus
}

export interface KPIItem {
  id: string
  metric: string
  target: string
  actual: string
  weight: string
  score: number
  status: KPIStatus
}

export interface DocumentFile {
  id: string
  name: string
  uploadDate: string
  fileSize: string
  fileType: string
}

export interface ActivityEntry {
  id: string
  action: string
  actor: string
  timestamp: string
  type: ActivityType
}
