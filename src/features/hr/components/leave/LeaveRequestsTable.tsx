import { useState, useMemo } from 'react'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
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
  'Annual Leave':  'bg-[#f8ede8] text-[#a9583e]',
  'Sick Leave':    'bg-[#fde8e8] text-[#9e3535]',
  'Maternity':     'bg-[#e0f5f2] text-[#357a70]',
  'Paternity':     'bg-[#e0f5f2] text-[#357a70]',
  'Unpaid Leave':  'bg-[#f0ebe3] text-[#6c6a64]',
  'WFH':           'bg-[#e6f5ea] text-[#2d7a40]',
  'Compassionate': 'bg-[#fdf0e0] text-[#9a6b2a]',
}

const STATUS_BADGE: Record<LeaveStatus, string> = {
  'Pending':   'bg-[#fdf0e0] text-[#9a6b2a]',
  'Approved':  'bg-[#e6f5ea] text-[#2d7a40]',
  'Rejected':  'bg-[#fde8e8] text-[#9e3535]',
  'Cancelled': 'bg-[#f0ebe3] text-[#6c6a64]',
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
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">

      {/* Tabs */}
      <div className="flex items-center gap-0.5 px-4 pt-4 border-b border-[#f0ebe3]">
        {TABS.map((tab) => {
          const count = tab === 'Pending' ? pendingCount : undefined
          const active = activeTab === tab
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-t-lg border-b-2 transition-colors cursor-pointer"
              style={{
                borderColor:      active ? '#cc785c' : 'transparent',
                color:            active ? '#a9583e' : '#8e8b82',
                backgroundColor:  active ? 'rgba(204,120,92,0.05)' : 'transparent',
              }}
            >
              {tab}
              {count != null && count > 0 && (
                <span
                  className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full min-w-[18px] text-center"
                  style={{ backgroundColor: '#cc785c', color: '#fff' }}
                >
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
            <TableRow className="border-[#f0ebe3]">
              <TableHead className="text-[11px] font-medium text-[#8e8b82] pl-5">Employee</TableHead>
              <TableHead className="text-[11px] font-medium text-[#8e8b82]">Leave Type</TableHead>
              <TableHead className="text-[11px] font-medium text-[#8e8b82]">From</TableHead>
              <TableHead className="text-[11px] font-medium text-[#8e8b82]">To</TableHead>
              <TableHead className="text-[11px] font-medium text-[#8e8b82]">Days</TableHead>
              <TableHead className="text-[11px] font-medium text-[#8e8b82] max-w-[140px]">Reason</TableHead>
              <TableHead className="text-[11px] font-medium text-[#8e8b82]">Applied</TableHead>
              <TableHead className="text-[11px] font-medium text-[#8e8b82]">Status</TableHead>
              <TableHead className="text-[11px] font-medium text-[#8e8b82]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((req) => (
              <TableRow key={req.id} className="border-[#f0ebe3] hover:bg-[#faf9f5] transition-colors">

                {/* Employee */}
                <TableCell className="pl-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold text-white shrink-0"
                      style={{ backgroundColor: '#cc785c' }}
                    >
                      {req.employee.initials}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-[#141413] leading-tight">{req.employee.name}</p>
                      <p className="text-[10px] text-[#8e8b82]">{req.employee.department}</p>
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
                <TableCell className="text-xs text-[#6c6a64] whitespace-nowrap">{req.from}</TableCell>
                <TableCell className="text-xs text-[#6c6a64] whitespace-nowrap">{req.to}</TableCell>

                {/* Days */}
                <TableCell>
                  <span className="text-xs font-semibold text-[#3d3d3a]">{req.days}d</span>
                </TableCell>

                {/* Reason */}
                <TableCell className="max-w-[140px]">
                  <p className="text-xs text-[#6c6a64] truncate" title={req.reason}>{req.reason}</p>
                </TableCell>

                {/* Applied On */}
                <TableCell className="text-xs text-[#8e8b82] whitespace-nowrap">{req.appliedOn}</TableCell>

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
                        className="h-6 px-2.5 text-[10px] font-medium rounded text-white cursor-pointer transition-opacity hover:opacity-90"
                        style={{ backgroundColor: '#5db872' }}
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setConfirmAction({ type: 'decline', reqId: req.id }) }}
                        className="h-6 px-2.5 text-[10px] font-medium rounded border cursor-pointer transition-colors hover:bg-[#fde8e8]"
                        style={{ borderColor: '#c64545', color: '#c64545' }}
                      >
                        Decline
                      </button>
                    </div>
                  ) : req.actionedBy ? (
                    <div>
                      <p className="text-[10px] text-[#8e8b82]">by {req.actionedBy}</p>
                      <p className="text-[10px] text-[#8e8b82]">{req.actionedAt}</p>
                    </div>
                  ) : (
                    <span className="text-[10px] text-[#8e8b82]">—</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-sm text-[#8e8b82] py-10">
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
              className="text-base font-semibold"
              style={{ color: confirmAction?.type === 'approve' ? '#2d7a40' : '#9e3535' }}
            >
              {confirmAction?.type === 'approve' ? 'Approve Leave Request' : 'Decline Leave Request'}
            </DialogTitle>
          </DialogHeader>

          <div className="py-2">
            <p className="text-sm text-[#6c6a64] mb-4">
              {confirmAction?.type === 'approve'
                ? 'Confirm approval. You may add optional notes for the employee.'
                : 'Please provide a reason for declining this request.'}
            </p>
            <label className="text-xs font-medium text-[#3d3d3a] block mb-1.5">
              {confirmAction?.type === 'approve' ? 'Notes (optional)' : 'Reason (required)'}
            </label>
            <textarea
              value={actionNotes}
              onChange={(e) => setActionNotes(e.target.value)}
              rows={3}
              placeholder={confirmAction?.type === 'approve'
                ? 'Any message for the employee...'
                : 'Reason for declining...'}
              className="w-full rounded-lg border border-[#e6dfd8] px-3 py-2 text-sm text-[#3d3d3a] placeholder:text-[#8e8b82] outline-none focus:ring-1 resize-none"
              style={{ focusRingColor: '#cc785c' } as React.CSSProperties}
            />
          </div>

          <DialogFooter className="gap-2">
            <button
              type="button"
              onClick={() => { setConfirmAction(null); setActionNotes('') }}
              className="px-4 py-2 text-sm font-medium border rounded-lg cursor-pointer transition-colors hover:bg-[#f5f0e8]"
              style={{ borderColor: '#e6dfd8', color: '#6c6a64' }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={confirmAction?.type === 'decline' && !actionNotes.trim()}
              className="px-4 py-2 text-sm font-medium rounded-lg text-white cursor-pointer transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ backgroundColor: confirmAction?.type === 'approve' ? '#5db872' : '#c64545' }}
            >
              {confirmAction?.type === 'approve' ? 'Confirm Approval' : 'Confirm Decline'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
