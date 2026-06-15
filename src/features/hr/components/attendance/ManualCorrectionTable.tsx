import { useState } from 'react'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'

import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import type { CorrectionRequest, CorrectionStatus } from '../../types/attendance.types'

// ─── Mock data ────────────────────────────────────────────────────────────────

const CORRECTIONS: CorrectionRequest[] = [
  {
    id: 'CR-001',
    employee: { id: 'EMP-0017', name: 'Trần Thị Bích',  initials: 'TTB', department: 'Engineering' },
    date: '22 May 2025',
    originalCheckIn: '09:15',  originalCheckOut: '18:00',
    requestedCheckIn: '08:10', requestedCheckOut: '17:05',
    reason: 'Forgot to clock in on time — arrived at building at 08:10, badge log confirms.',
    status: 'Pending',
  },
  {
    id: 'CR-002',
    employee: { id: 'EMP-0031', name: 'Lê Minh Dũng',   initials: 'LMD', department: 'Design' },
    date: '20 May 2025',
    originalCheckIn: '—',      originalCheckOut: '—',
    requestedCheckIn: '08:00', requestedCheckOut: '17:00',
    reason: 'System error — biometric scanner was offline all day, as reported in IT ticket IT-4521.',
    status: 'Approved',
  },
  {
    id: 'CR-003',
    employee: { id: 'EMP-0058', name: 'Phạm Hải Yến',   initials: 'PHY', department: 'HR' },
    date: '19 May 2025',
    originalCheckIn: '08:00',  originalCheckOut: '13:00',
    requestedCheckIn: '08:00', requestedCheckOut: '17:30',
    reason: "Check-out wasn't recorded — I was in a meeting that ran past 5pm.",
    status: 'Rejected',
  },
  {
    id: 'CR-004',
    employee: { id: 'EMP-0044', name: 'Đặng Thị Mai',   initials: 'ĐTM', department: 'Product' },
    date: '15 May 2025',
    originalCheckIn: '10:00',  originalCheckOut: '19:00',
    requestedCheckIn: '08:05', requestedCheckOut: '17:05',
    reason: 'Late entry due to offsite client visit in the morning, confirmed by manager.',
    status: 'Pending',
  },
]

// ─── Style maps ───────────────────────────────────────────────────────────────

const STATUS_BADGE: Record<CorrectionStatus, string> = {
  Pending:  'bg-[#e8a55a]/10 text-[#9a6b2a]',
  Approved: 'bg-[#5db872]/10 text-[#2d7a40]',
  Rejected: 'bg-[#c64545]/10 text-[#c64545]',
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ManualCorrectionTable() {
  const [selected, setSelected] = useState<CorrectionRequest | null>(null)
  const pendingCount = CORRECTIONS.filter((c) => c.status === 'Pending').length

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-[#f0ebe3]">
          <h3 className="text-sm font-semibold text-[#141413]">Manual Correction Requests</h3>
          {pendingCount > 0 && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#e8a55a]/15 text-[#9a6b2a]">
              {pendingCount} pending
            </span>
          )}
        </div>

        <Table>
          <TableHeader>
            <TableRow className="border-[#f0ebe3]">
              <TableHead className="text-xs font-medium text-[#8e8b82] pl-5">Employee</TableHead>
              <TableHead className="text-xs font-medium text-[#8e8b82]">Date</TableHead>
              <TableHead className="text-xs font-medium text-[#8e8b82]">Original</TableHead>
              <TableHead className="text-xs font-medium text-[#8e8b82]">Requested</TableHead>
              <TableHead className="text-xs font-medium text-[#8e8b82]">Reason</TableHead>
              <TableHead className="text-xs font-medium text-[#8e8b82]">Status</TableHead>
              <TableHead className="text-xs font-medium text-[#8e8b82]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {CORRECTIONS.map((req) => (
              <TableRow key={req.id} className="border-[#f0ebe3]">
                <TableCell className="pl-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold bg-[#cc785c]/15 text-[#a9583e] shrink-0">
                      {req.employee.initials}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#141413] leading-tight">{req.employee.name}</p>
                      <p className="text-xs text-[#8e8b82]">{req.employee.department}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-[#6c6a64]">{req.date}</TableCell>
                <TableCell className="font-mono text-xs text-[#6c6a64]">
                  {req.originalCheckIn} – {req.originalCheckOut}
                </TableCell>
                <TableCell className="font-mono text-xs text-[#3d3d3a] font-medium">
                  {req.requestedCheckIn} – {req.requestedCheckOut}
                </TableCell>
                <TableCell className="text-xs text-[#8e8b82] italic max-w-[180px] truncate">
                  {req.reason}
                </TableCell>
                <TableCell>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_BADGE[req.status]}`}>
                    {req.status}
                  </span>
                </TableCell>
                <TableCell>
                  <button
                    type="button"
                    onClick={() => setSelected(req)}
                    className="text-xs font-medium px-2.5 py-1 rounded-md border border-[#cc785c] text-[#cc785c] hover:bg-[#cc785c]/5 transition-colors cursor-pointer"
                  >
                    Review
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Review Dialog */}
      <Dialog open={!!selected} onOpenChange={(open) => { if (!open) setSelected(null) }}>
        {selected && (
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-base font-semibold text-[#141413]">
                Review Correction Request
              </DialogTitle>
            </DialogHeader>

            {/* Employee info */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-[#faf9f5] border border-[#e6dfd8]">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold bg-[#cc785c]/15 text-[#a9583e] shrink-0">
                {selected.employee.initials}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#141413]">{selected.employee.name}</p>
                <p className="text-xs text-[#8e8b82]">{selected.employee.id} · {selected.employee.department}</p>
              </div>
              <span className="ml-auto text-xs font-medium px-2 py-0.5 rounded-full bg-[#efe9de] text-[#6c6a64]">
                {selected.date}
              </span>
            </div>

            {/* Time comparison */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg border border-[#f0ebe3]">
                <p className="text-[10px] font-medium uppercase tracking-wide text-[#8e8b82] mb-1.5">Original</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#6c6a64]">Check-in</span>
                    <span className="font-mono font-medium text-[#3d3d3a]">{selected.originalCheckIn}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#6c6a64]">Check-out</span>
                    <span className="font-mono font-medium text-[#3d3d3a]">{selected.originalCheckOut}</span>
                  </div>
                </div>
              </div>
              <div className="p-3 rounded-lg border border-[#cc785c]/30 bg-[#cc785c]/5">
                <p className="text-[10px] font-medium uppercase tracking-wide text-[#cc785c] mb-1.5">Requested</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#6c6a64]">Check-in</span>
                    <span className="font-mono font-medium text-[#3d3d3a]">{selected.requestedCheckIn}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#6c6a64]">Check-out</span>
                    <span className="font-mono font-medium text-[#3d3d3a]">{selected.requestedCheckOut}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Reason */}
            <div>
              <p className="text-xs font-medium text-[#8e8b82] mb-1.5">Reason</p>
              <p className="text-sm text-[#3d3d3a] leading-relaxed bg-[#faf9f5] p-3 rounded-lg border border-[#e6dfd8]">
                {selected.reason}
              </p>
            </div>

            <DialogFooter className="gap-2">
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-[#e6dfd8] text-[#6c6a64] hover:bg-[#f5f0e8] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-[#c64545] text-[#c64545] hover:bg-[#c64545]/5 transition-colors cursor-pointer"
              >
                Reject
              </button>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-[#5db872] text-white hover:bg-[#4da862] transition-colors cursor-pointer"
              >
                Approve
              </button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </>
  )
}
