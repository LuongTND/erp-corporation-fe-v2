import { useState, useMemo } from 'react'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import type { LeaveRequest, LeaveStatus, LeaveType } from '../../types/leave.types'

// ─── Mock data ────────────────────────────────────────────────────────────────

const INITIAL_REQUESTS: LeaveRequest[] = [
  {
    id: 'LR-001',
    employee: { id: 'EMP-0001', name: 'Nguyễn Văn An', initials: 'NVA', department: 'Engineering' },
    type: 'Annual Leave', from: '05 May 2025', to: '09 May 2025', days: 5,
    reason: 'Family vacation to Da Nang.',
    appliedOn: '28 Apr 2025', status: 'Pending',
  },
  {
    id: 'LR-002',
    employee: { id: 'EMP-0017', name: 'Trần Thị Bích', initials: 'TTB', department: 'Engineering' },
    type: 'Sick Leave', from: '12 May 2025', to: '13 May 2025', days: 2,
    reason: 'Fever and flu symptoms.',
    appliedOn: '12 May 2025', status: 'Pending',
  },
  {
    id: 'LR-003',
    employee: { id: 'EMP-0031', name: 'Lê Minh Dũng', initials: 'LMD', department: 'Design' },
    type: 'WFH', from: '19 May 2025', to: '23 May 2025', days: 5,
    reason: 'Internet upgrade at new apartment.',
    appliedOn: '15 May 2025', status: 'Approved',
    actionedBy: 'Võ Thị Kim', actionedAt: '16 May 2025, 09:14',
  },
  {
    id: 'LR-004',
    employee: { id: 'EMP-0058', name: 'Phạm Hải Yến', initials: 'PHY', department: 'HR' },
    type: 'Annual Leave', from: '26 May 2025', to: '30 May 2025', days: 5,
    reason: 'Personal time off.',
    appliedOn: '20 May 2025', status: 'Pending',
  },
  {
    id: 'LR-005',
    employee: { id: 'EMP-0044', name: 'Đặng Thị Mai', initials: 'ĐTM', department: 'Product' },
    type: 'Compassionate', from: '07 May 2025', to: '08 May 2025', days: 2,
    reason: 'Family bereavement.',
    appliedOn: '06 May 2025', status: 'Approved',
    actionedBy: 'Trần Quốc Bảo', actionedAt: '06 May 2025, 18:45',
  },
  {
    id: 'LR-006',
    employee: { id: 'EMP-0072', name: 'Hoàng Văn Tú', initials: 'HVT', department: 'Finance' },
    type: 'Sick Leave', from: '14 May 2025', to: '14 May 2025', days: 1,
    reason: 'Medical appointment.',
    appliedOn: '14 May 2025', status: 'Rejected',
    actionedBy: 'Lê Thị Hồng', actionedAt: '14 May 2025, 11:30',
  },
  {
    id: 'LR-007',
    employee: { id: 'EMP-0089', name: 'Vũ Thị Lan', initials: 'VTL', department: 'Design' },
    type: 'Annual Leave', from: '02 Jun 2025', to: '06 Jun 2025', days: 5,
    reason: 'Summer holiday.',
    appliedOn: '22 May 2025', status: 'Pending',
  },
  {
    id: 'LR-008',
    employee: { id: 'EMP-0103', name: 'Bùi Minh Khoa', initials: 'BMK', department: 'Engineering' },
    type: 'Unpaid Leave', from: '20 May 2025', to: '21 May 2025', days: 2,
    reason: 'Personal reasons.',
    appliedOn: '18 May 2025', status: 'Cancelled',
  },
]

// ─── Style maps ───────────────────────────────────────────────────────────────

const TYPE_BADGE: Record<LeaveType, string> = {
  'Annual Leave':  'bg-primary/10 text-primary/80',
  'Sick Leave':    'bg-destructive/12 text-destructive',
  'Maternity':     'bg-teal-500/15 text-teal-700 dark:text-teal-400',
  'Paternity':     'bg-teal-500/15 text-teal-700 dark:text-teal-400',
  'Unpaid Leave':  'bg-muted text-muted-foreground',
  'WFH':           'bg-green-500/12 dark:bg-green-500/20 text-green-700 dark:text-green-400',
  'Compassionate': 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
}

const STATUS_BADGE: Record<LeaveStatus, string> = {
  'Pending':   'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  'Approved':  'bg-green-500/12 dark:bg-green-500/20 text-green-700 dark:text-green-400',
  'Rejected':  'bg-destructive/12 text-destructive',
  'Cancelled': 'bg-muted text-muted-foreground',
}

const TABS = ['All', 'Pending', 'Approved', 'Rejected', 'Cancelled'] as const
type Tab = typeof TABS[number]

// ─── Component ────────────────────────────────────────────────────────────────

export function LeaveRequestsTable() {
  const [requests, setRequests]           = useState<LeaveRequest[]>(INITIAL_REQUESTS)
  const [activeTab, setActiveTab]         = useState<Tab>('All')
  const [confirmAction, setConfirmAction] = useState<{ type: 'approve' | 'decline'; reqId: string } | null>(null)
  const [actionNotes, setActionNotes]     = useState('')

  const filtered = useMemo(() =>
    activeTab === 'All'
      ? requests
      : requests.filter((r) => r.status === activeTab),
    [requests, activeTab],
  )

  const handleConfirm = () => {
    if (!confirmAction) return
    const newStatus: LeaveStatus = confirmAction.type === 'approve' ? 'Approved' : 'Rejected'
    setRequests((prev) =>
      prev.map((r) =>
        r.id === confirmAction.reqId
          ? { ...r, status: newStatus, actionedBy: 'You', actionedAt: 'Just now' }
          : r,
      ),
    )
    setConfirmAction(null)
    setActionNotes('')
  }

  const pendingCount = requests.filter((r) => r.status === 'Pending').length

  return (
    <div className="bg-card rounded-xl shadow-sm overflow-hidden">

      {/* Tabs */}
      <div className="flex items-center gap-0.5 px-4 pt-4 border-b border-border">
        {TABS.map((tab) => {
          const count = tab === 'Pending' ? pendingCount : undefined
          const active = activeTab === tab
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-t-lg border-b-2 transition-colors cursor-pointer',
                active
                  ? 'border-primary text-primary/80 bg-primary/5'
                  : 'border-transparent text-muted-foreground',
              )}
            >
              {tab}
              {count != null && count > 0 && (
                <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full min-w-[18px] text-center bg-primary text-white">
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border">
              <TableHead className="text-[11px] font-medium text-muted-foreground pl-5">Employee</TableHead>
              <TableHead className="text-[11px] font-medium text-muted-foreground">Leave Type</TableHead>
              <TableHead className="text-[11px] font-medium text-muted-foreground">From</TableHead>
              <TableHead className="text-[11px] font-medium text-muted-foreground">To</TableHead>
              <TableHead className="text-[11px] font-medium text-muted-foreground">Days</TableHead>
              <TableHead className="text-[11px] font-medium text-muted-foreground max-w-[140px]">Reason</TableHead>
              <TableHead className="text-[11px] font-medium text-muted-foreground">Applied</TableHead>
              <TableHead className="text-[11px] font-medium text-muted-foreground">Status</TableHead>
              <TableHead className="text-[11px] font-medium text-muted-foreground">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((req) => (
              <TableRow key={req.id} className="border-border hover:bg-card transition-colors">

                {/* Employee */}
                <TableCell className="pl-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold text-white shrink-0 bg-primary">
                      {req.employee.initials}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground leading-tight">{req.employee.name}</p>
                      <p className="text-[10px] text-muted-foreground">{req.employee.department}</p>
                    </div>
                  </div>
                </TableCell>

                {/* Leave Type */}
                <TableCell>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${TYPE_BADGE[req.type]}`}>
                    {req.type}
                  </span>
                </TableCell>

                {/* From / To */}
                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{req.from}</TableCell>
                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{req.to}</TableCell>

                {/* Days */}
                <TableCell>
                  <span className="text-xs font-semibold text-foreground">{req.days}d</span>
                </TableCell>

                {/* Reason */}
                <TableCell className="max-w-[140px]">
                  <p className="text-xs text-muted-foreground truncate" title={req.reason}>{req.reason}</p>
                </TableCell>

                {/* Applied On */}
                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{req.appliedOn}</TableCell>

                {/* Status */}
                <TableCell>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${STATUS_BADGE[req.status]}`}>
                    {req.status}
                  </span>
                </TableCell>

                {/* Action */}
                <TableCell>
                  {req.status === 'Pending' ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setConfirmAction({ type: 'approve', reqId: req.id }) }}
                        className="h-6 px-2.5 text-[10px] font-medium rounded text-white cursor-pointer transition-opacity hover:opacity-90 bg-green-500"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setConfirmAction({ type: 'decline', reqId: req.id }) }}
                        className="h-6 px-2.5 text-[10px] font-medium rounded border border-destructive text-destructive cursor-pointer transition-colors hover:bg-destructive/12"
                      >
                        Decline
                      </button>
                    </div>
                  ) : req.actionedBy ? (
                    <div>
                      <p className="text-[10px] text-muted-foreground">by {req.actionedBy}</p>
                      <p className="text-[10px] text-muted-foreground">{req.actionedAt}</p>
                    </div>
                  ) : (
                    <span className="text-[10px] text-muted-foreground">—</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-sm text-muted-foreground py-10">
                  No requests found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Confirm Dialog */}
      <Dialog
        open={!!confirmAction}
        onOpenChange={(open) => { if (!open) { setConfirmAction(null); setActionNotes('') } }}
      >
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle
              className={cn(
                'text-base font-semibold',
                confirmAction?.type === 'approve' ? 'text-green-700 dark:text-green-400' : 'text-destructive',
              )}
            >
              {confirmAction?.type === 'approve' ? 'Approve Leave Request' : 'Decline Leave Request'}
            </DialogTitle>
          </DialogHeader>

          <div className="py-2">
            <p className="text-sm text-muted-foreground mb-4">
              {confirmAction?.type === 'approve'
                ? 'Confirm approval. You may add optional notes for the employee.'
                : 'Please provide a reason for declining this request.'}
            </p>
            <label className="text-xs font-medium text-foreground block mb-1.5">
              {confirmAction?.type === 'approve' ? 'Notes (optional)' : 'Reason (required)'}
            </label>
            <textarea
              value={actionNotes}
              onChange={(e) => setActionNotes(e.target.value)}
              rows={3}
              placeholder={confirmAction?.type === 'approve'
                ? 'Any message for the employee...'
                : 'Reason for declining...'}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 resize-none"
            />
          </div>

          <DialogFooter className="gap-2">
            <button
              type="button"
              onClick={() => { setConfirmAction(null); setActionNotes('') }}
              className="px-4 py-2 text-sm font-medium border border-border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 text-muted-foreground"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={confirmAction?.type === 'decline' && !actionNotes.trim()}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-lg text-white cursor-pointer transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed',
                confirmAction?.type === 'approve' ? 'bg-green-500' : 'bg-destructive',
              )}
            >
              {confirmAction?.type === 'approve' ? 'Confirm Approval' : 'Confirm Decline'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
