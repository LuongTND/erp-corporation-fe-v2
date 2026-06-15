export interface AttendanceOverviewItem {
  day: string
  present: number
  absent: number
}

export interface DepartmentHeadcountItem {
  name: string
  count: number
  color: string
}

export interface RecentHireItem {
  initials: string
  name: string
  position: string
  dept: string
  joinDate: string
}

export interface LeaveRequestItem {
  initials: string
  name: string
  type: string
  typeStyle: string
  dates: string
}

export interface DepartmentKpiItem {
  dept: string
  pct: number
}

export const attendanceOverviewData: AttendanceOverviewItem[] = [
  { day: 'Mon', present: 142, absent: 8 },
  { day: 'Tue', present: 138, absent: 12 },
  { day: 'Wed', present: 145, absent: 5 },
  { day: 'Thu', present: 140, absent: 10 },
  { day: 'Fri', present: 136, absent: 14 },
  { day: 'Sat', present: 98, absent: 52 },
]

export const departmentHeadcountData: DepartmentHeadcountItem[] = [
  { name: 'Engineering', count: 45, color: '#6366f1' },
  { name: 'Sales', count: 38, color: '#10b981' },
  { name: 'Marketing', count: 22, color: '#f59e0b' },
  { name: 'HR', count: 12, color: '#8b5cf6' },
  { name: 'Finance', count: 18, color: '#f43f5e' },
  { name: 'Operations', count: 15, color: '#14b8a6' },
]

export const recentHireData: RecentHireItem[] = [
  { initials: 'NTH', name: 'Nguyễn Thị Hoa', position: 'Frontend Engineer', dept: 'Engineering', joinDate: '20 May' },
  { initials: 'LVA', name: 'Lê Văn An', position: 'Sales Executive', dept: 'Sales', joinDate: '18 May' },
  { initials: 'PTM', name: 'Phạm Thị Mai', position: 'Marketing Analyst', dept: 'Marketing', joinDate: '15 May' },
  { initials: 'TQB', name: 'Trần Quốc Bảo', position: 'DevOps Engineer', dept: 'Engineering', joinDate: '12 May' },
  { initials: 'HNL', name: 'Hoàng Ngọc Lan', position: 'HR Specialist', dept: 'HR', joinDate: '10 May' },
]

export const leaveRequestData: LeaveRequestItem[] = [
  { initials: 'VM', name: 'Võ Minh', type: 'Annual', typeStyle: 'bg-indigo-50 text-indigo-700', dates: '26–28 May 2025' },
  { initials: 'TTH', name: 'Trần Thị Hằng', type: 'Sick', typeStyle: 'bg-red-50 text-red-700', dates: '27 May 2025' },
  { initials: 'NVD', name: 'Nguyễn Văn Dũng', type: 'WFH', typeStyle: 'bg-emerald-50 text-emerald-700', dates: '28–30 May 2025' },
  { initials: 'PLT', name: 'Phan Lan Thanh', type: 'Annual', typeStyle: 'bg-indigo-50 text-indigo-700', dates: '02–04 Jun 2025' },
]

export const departmentKpiData: DepartmentKpiItem[] = [
  { dept: 'Engineering', pct: 88 },
  { dept: 'Sales', pct: 72 },
  { dept: 'Marketing', pct: 65 },
  { dept: 'HR', pct: 91 },
  { dept: 'Finance', pct: 55 },
  { dept: 'Operations', pct: 78 },
  { dept: 'IT Support', pct: 43 },
]

export const totalHeadcount = departmentHeadcountData.reduce((sum, item) => sum + item.count, 0)

export function getDepartmentKpiColor(percent: number) {
  if (percent >= 80) return '#10b981'
  if (percent >= 60) return '#f59e0b'
  return '#ef4444'
}
