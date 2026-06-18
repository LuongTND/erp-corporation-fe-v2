import { Banknote, CalendarOff, Target, TrendingUp, UserCheck, Users } from 'lucide-react'

export function HRMDashboardStatCards() {
  return (
    <div className="grid grid-cols-5 gap-4">
      <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">Total Employees</span>
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50">
            <Users className="h-4 w-4 text-indigo-600" />
          </span>
        </div>
        <span className="mt-1 text-3xl font-bold text-foreground">150</span>
        <div className="flex items-center gap-1">
          <TrendingUp className="h-3 w-3 text-emerald-600" />
          <span className="text-xs font-medium text-emerald-600">+3 this month</span>
        </div>
      </div>

      <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">Present Today</span>
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50">
            <UserCheck className="h-4 w-4 text-emerald-600" />
          </span>
        </div>
        <span className="mt-1 text-3xl font-bold text-foreground">138</span>
        <span className="text-xs text-muted-foreground">92% attendance rate</span>
      </div>

      <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">On Leave</span>
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50">
            <CalendarOff className="h-4 w-4 text-amber-500" />
          </span>
        </div>
        <span className="mt-1 text-3xl font-bold text-foreground">8</span>
        <span className="text-xs font-medium text-amber-600">4 pending approval</span>
      </div>

      <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">Payroll This Month</span>
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50">
            <Banknote className="h-4 w-4 text-indigo-600" />
          </span>
        </div>
        <span className="mt-1 text-2xl font-bold text-foreground">₫ 2.4B</span>
        <span className="inline-flex items-center self-start rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
          Processed
        </span>
      </div>

      <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">KPI Reviews Due</span>
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-50">
            <Target className="h-4 w-4 text-red-500" />
          </span>
        </div>
        <span className="mt-1 text-3xl font-bold text-foreground">12</span>
        <span className="text-xs font-medium text-red-600">Due in 5 days</span>
      </div>
    </div>
  )
}
