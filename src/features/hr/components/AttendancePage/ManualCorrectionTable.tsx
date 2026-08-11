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
  Pending:  'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  Approved: 'bg-green-500/12 dark:bg-green-500/20 text-green-700 dark:text-green-400',
  Rejected: 'bg-destructive/12 text-destructive',
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ManualCorrectionTable() {
  const [selected, setSelected] = useState<CorrectionRequest | null>(null)
  const pendingCount = CORRECTIONS.filter((c) => c.status === 'Pending').length

  return (
    <>
      <div className="bg-card rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Manual Correction Requests</h3>
          {pendingCount > 0 && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400">
              {pendingCount} pending
            </span>
          )}
        </div>

        <Table>
          <TableHeader>
            <TableRow className="border-border">
              <TableHead className="text-xs font-medium text-muted-foreground pl-5">Employee</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Date</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Original</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Requested</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Reason</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {CORRECTIONS.map((correction) => (
              <TableRow key={correction.id} className="border-border">
                <TableCell className="pl-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold bg-primary/15 text-primary shrink-0">
                      {correction.employee.initials}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground leading-tight">{correction.employee.name}</p>
                      <p className="text-xs text-muted-foreground">{correction.employee.department}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{correction.date}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {correction.originalCheckIn} – {correction.originalCheckOut}
                </TableCell>
                <TableCell className="font-mono text-xs text-foreground font-medium">
                  {correction.requestedCheckIn} – {correction.requestedCheckOut}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground italic max-w-[180px] truncate">
                  {correction.reason}
                </TableCell>
                <TableCell>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_BADGE[correction.status]}`}>
                    {correction.status}
                  </span>
                </TableCell>
                <TableCell>
                  <button
                    type="button"
                    onClick={() => setSelected(correction)}
                    className="text-xs font-medium px-2.5 py-1 rounded-md border border-primary text-primary hover:bg-primary/5 transition-colors cursor-pointer"
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
              <DialogTitle className="text-base font-semibold text-foreground">
                Review Correction Request
              </DialogTitle>
            </DialogHeader>

            {/* Employee info */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold bg-primary/15 text-primary shrink-0">
                {selected.employee.initials}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{selected.employee.name}</p>
                <p className="text-xs text-muted-foreground">{selected.employee.id} · {selected.employee.department}</p>
              </div>
              <span className="ml-auto text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                {selected.date}
              </span>
            </div>

            {/* Time comparison */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg border border-border">
                <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground mb-1.5">Original</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Check-in</span>
                    <span className="font-mono font-medium text-foreground">{selected.originalCheckIn}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Check-out</span>
                    <span className="font-mono font-medium text-foreground">{selected.originalCheckOut}</span>
                  </div>
                </div>
              </div>
              <div className="p-3 rounded-lg border border-primary/30 bg-primary/5">
                <p className="text-[10px] font-medium uppercase tracking-wide text-primary mb-1.5">Requested</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Check-in</span>
                    <span className="font-mono font-medium text-foreground">{selected.requestedCheckIn}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Check-out</span>
                    <span className="font-mono font-medium text-foreground">{selected.requestedCheckOut}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Reason */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1.5">Reason</p>
              <p className="text-sm text-foreground leading-relaxed bg-card p-3 rounded-lg border border-border">
                {selected.reason}
              </p>
            </div>

            <DialogFooter className="gap-2">
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-border text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-destructive text-destructive hover:bg-destructive/5 transition-colors cursor-pointer"
              >
                Reject
              </button>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors cursor-pointer"
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
