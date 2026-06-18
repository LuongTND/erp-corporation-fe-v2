import { useState } from 'react'
import { Plus, BookOpen } from 'lucide-react'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { LeaveStatCards }     from '@/features/hr/components/leave/LeaveStatCards'
import { LeaveRequestsTable } from '@/features/hr/components/leave/LeaveRequestsTable'
import { LeaveBalancePanel }  from '@/features/hr/components/leave/LeaveBalancePanel'
import { LeaveCalendar }      from '@/features/hr/components/leave/LeaveCalendar'
import { NewLeaveDialog }     from '@/features/hr/components/leave/NewLeaveDialog'

const MONTHS = [
  'May 2025', 'Apr 2025', 'Mar 2025', 'Jun 2025', 'Jul 2025',
]

const DEPARTMENTS = ['All Departments', 'Engineering', 'Design', 'HR', 'Product', 'Finance', 'Sales']

export default function LeavePage() {
  const [month,           setMonth]           = useState('May 2025')
  const [dept,            setDept]            = useState('All Departments')
  const [showLeaveDialog, setShowLeaveDialog] = useState(false)

  return (
    <div className="min-h-screen bg-card">
      <div className="max-w-7xl mx-auto p-8 space-y-6">

        {/* Page header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Leave Management</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Track, approve and manage team leave requests</p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Month/Year picker */}
            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger
                className="h-9 w-[120px] text-sm border border-border rounded-lg cursor-pointer font-medium bg-card text-foreground"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((m) => (
                  <SelectItem key={m} value={m} className="text-sm cursor-pointer">{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Department filter */}
            <Select value={dept} onValueChange={setDept}>
              <SelectTrigger
                className="h-9 w-[160px] text-sm border border-border rounded-lg cursor-pointer bg-card text-foreground"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DEPARTMENTS.map((d) => (
                  <SelectItem key={d} value={d} className="text-sm cursor-pointer">{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* New Leave Request */}
            <button
              type="button"
              onClick={() => setShowLeaveDialog(true)}
              className="flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-medium text-white cursor-pointer transition-opacity hover:opacity-90 bg-primary"
            >
              <Plus className="w-4 h-4" />
              New Leave Request
            </button>

            {/* Leave Policy */}
            <button
              type="button"
              className="flex items-center gap-2 h-9 px-3 rounded-lg text-sm font-medium border border-border cursor-pointer transition-colors hover:bg-muted/50 bg-card text-muted-foreground"
            >
              <BookOpen className="w-4 h-4" />
              Leave Policy
            </button>
          </div>
        </div>

        {/* Section 1 — Stat cards */}
        <LeaveStatCards />

        {/* Section 2 — 60/40 layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[60fr_40fr] gap-4 items-start">
          <LeaveRequestsTable />
          <LeaveBalancePanel onRequestLeave={() => setShowLeaveDialog(true)} />
        </div>

        {/* Section 3 — Team Calendar */}
        <LeaveCalendar />

      </div>

      {/* FAB */}
      <button
        type="button"
        onClick={() => setShowLeaveDialog(true)}
        aria-label="Add leave request"
        className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center cursor-pointer transition-opacity hover:opacity-90 bg-primary"
      >
        <Plus className="w-6 h-6 text-white" />
      </button>

      {/* New Leave Dialog */}
      <NewLeaveDialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog} />
    </div>
  )
}
