import { Banknote, CalendarOff, Target, TrendingUp, UserCheck, Users } from 'lucide-react'

export function HRMDashboardStatCards() {
  return (
    <div className="grid grid-cols-5 gap-4">
      <div className="flex flex-col gap-2 rounded-xl border bg-white p-5 shadow-sm" style={{ borderColor: '#F0EDE8' }}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium" style={{ color: '#6B6B6B' }}>Total Employees</span>
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50">
            <Users className="h-4 w-4 text-indigo-600" />
          </span>
        </div>
        <span className="mt-1 text-3xl font-bold" style={{ color: '#0F172A' }}>150</span>
        <div className="flex items-center gap-1">
          <TrendingUp className="h-3 w-3 text-emerald-600" />
          <span className="text-xs font-medium text-emerald-600">+3 this month</span>
        </div>
      </div>

      <div className="flex flex-col gap-2 rounded-xl border bg-white p-5 shadow-sm" style={{ borderColor: '#F0EDE8' }}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium" style={{ color: '#6B6B6B' }}>Present Today</span>
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50">
            <UserCheck className="h-4 w-4 text-emerald-600" />
          </span>
        </div>
        <span className="mt-1 text-3xl font-bold" style={{ color: '#0F172A' }}>138</span>
        <span className="text-xs" style={{ color: '#6B6B6B' }}>92% attendance rate</span>
      </div>

      <div className="flex flex-col gap-2 rounded-xl border bg-white p-5 shadow-sm" style={{ borderColor: '#F0EDE8' }}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium" style={{ color: '#6B6B6B' }}>On Leave</span>
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50">
            <CalendarOff className="h-4 w-4 text-amber-500" />
          </span>
        </div>
        <span className="mt-1 text-3xl font-bold" style={{ color: '#0F172A' }}>8</span>
        <span className="text-xs font-medium text-amber-600">4 pending approval</span>
      </div>

      <div className="flex flex-col gap-2 rounded-xl border bg-white p-5 shadow-sm" style={{ borderColor: '#F0EDE8' }}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium" style={{ color: '#6B6B6B' }}>Payroll This Month</span>
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50">
            <Banknote className="h-4 w-4 text-indigo-600" />
          </span>
        </div>
        <span className="mt-1 text-2xl font-bold" style={{ color: '#0F172A' }}>₫ 2.4B</span>
        <span className="inline-flex items-center self-start rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
          Processed
        </span>
      </div>

      <div className="flex flex-col gap-2 rounded-xl border bg-white p-5 shadow-sm" style={{ borderColor: '#F0EDE8' }}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium" style={{ color: '#6B6B6B' }}>KPI Reviews Due</span>
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-50">
            <Target className="h-4 w-4 text-red-500" />
          </span>
        </div>
        <span className="mt-1 text-3xl font-bold" style={{ color: '#0F172A' }}>12</span>
        <span className="text-xs font-medium text-red-600">Due in 5 days</span>
      </div>
    </div>
  )
}
