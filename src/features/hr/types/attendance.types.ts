export type AttendanceStatus = 'On Time' | 'Late' | 'Absent' | 'Leave' | 'WFH'
export type CorrectionStatus = 'Pending' | 'Approved' | 'Rejected'

export interface DailyAttendanceRecord {
  id: string
  employee: {
    id: string
    name: string
    initials: string
    avatarUrl?: string
  }
  department: string
  checkIn: string | null
  checkOut: string | null
  workingHours: number
  status: AttendanceStatus
  note?: string
  lateMinutes?: number
}

export interface CalendarDayData {
  date: number
  attendanceRate: number
  present: number
  absent: number
  onLeave: number
  isWeekend: boolean
  isToday: boolean
}

export interface LateArrivalBar {
  day: string
  count: number
}

export interface OvertimeDataPoint {
  date: string
  hours: number
}

export interface CorrectionRequest {
  id: string
  employee: {
    id: string
    name: string
    initials: string
    department: string
  }
  date: string
  originalCheckIn: string
  originalCheckOut: string
  requestedCheckIn: string
  requestedCheckOut: string
  reason: string
  status: CorrectionStatus
}
