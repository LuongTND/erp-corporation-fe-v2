import { useState, useMemo } from 'react'
import { Paperclip, Upload } from 'lucide-react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import type { LeaveType } from '../../types/leave.types'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function workingDays(from: string, to: string): number {
  if (!from || !to) return 0
  const start = new Date(from)
  const end   = new Date(to)
  if (end < start) return 0
  let count = 0
  const cur = new Date(start)
  while (cur <= end) {
    const d = cur.getDay()
    if (d !== 0 && d !== 6) count++
    cur.setDate(cur.getDate() + 1)
  }
  return count
}

// Team leave blocks (May 2025) — used for overlap warning
const TEAM_BLOCKS = [
  { from: '2025-05-05', to: '2025-05-09', name: 'Nguyễn Văn An' },
  { from: '2025-05-12', to: '2025-05-13', name: 'Trần Thị Bích' },
  { from: '2025-05-19', to: '2025-05-26', name: 'Lê Minh Dũng' },
  { from: '2025-05-20', to: '2025-05-23', name: 'Bùi Minh Khoa' },
  { from: '2025-05-26', to: '2025-05-30', name: 'Phạm Hải Yến' },
]

function overlappingTeamMembers(from: string, to: string): string[] {
  if (!from || !to) return []
  const s = new Date(from)
  const e = new Date(to)
  return TEAM_BLOCKS
    .filter((b) => new Date(b.from) <= e && new Date(b.to) >= s)
    .map((b) => b.name.split(' ').slice(-1)[0])
}

const LEAVE_TYPES: LeaveType[] = [
  'Annual Leave', 'Sick Leave', 'WFH', 'Maternity', 'Paternity',
  'Compassionate', 'Unpaid Leave',
]

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewLeaveDialog({ open, onOpenChange }: Props) {
  const [leaveType,      setLeaveType]      = useState<LeaveType>('Annual Leave')
  const [fromDate,       setFromDate]       = useState('')
  const [toDate,         setToDate]         = useState('')
  const [reason,         setReason]         = useState('')
  const [notifyManager,  setNotifyManager]  = useState(true)
  const [fileName,       setFileName]       = useState('')

  const days     = useMemo(() => workingDays(fromDate, toDate),          [fromDate, toDate])
  const overlaps = useMemo(() => overlappingTeamMembers(fromDate, toDate), [fromDate, toDate])

  const isSickLeave = leaveType === 'Sick Leave'

  const handleReset = () => {
    setLeaveType('Annual Leave')
    setFromDate('')
    setToDate('')
    setReason('')
    setNotifyManager(true)
    setFileName('')
  }

  const handleClose = () => {
    handleReset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[520px] overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-[#141413]">
            New Leave Request
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">

          {/* Leave Type */}
          <div>
            <label className="text-xs font-medium text-[#3d3d3a] block mb-1.5">
              Leave Type <span className="text-[#c64545]">*</span>
            </label>
            <Select value={leaveType} onValueChange={(v) => setLeaveType(v as LeaveType)}>
              <SelectTrigger
                className="w-full h-9 text-sm border cursor-pointer"
                style={{ borderColor: '#e6dfd8', color: '#3d3d3a' }}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LEAVE_TYPES.map((t) => (
                  <SelectItem key={t} value={t} className="text-sm cursor-pointer">{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date range */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="leave-from" className="text-xs font-medium text-[#3d3d3a] block mb-1.5">
                From <span className="text-[#c64545]">*</span>
              </label>
              <input
                id="leave-from"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border text-sm text-[#3d3d3a] outline-none focus:ring-1 cursor-pointer"
                style={{ borderColor: '#e6dfd8' }}
              />
            </div>
            <div>
              <label htmlFor="leave-to" className="text-xs font-medium text-[#3d3d3a] block mb-1.5">
                To <span className="text-[#c64545]">*</span>
              </label>
              <input
                id="leave-to"
                type="date"
                value={toDate}
                min={fromDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border text-sm text-[#3d3d3a] outline-none focus:ring-1 cursor-pointer"
                style={{ borderColor: '#e6dfd8' }}
              />
            </div>
          </div>

          {/* Duration + overlap warning */}
          {days > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span
                  className="text-sm font-semibold"
                  style={{ color: '#cc785c' }}
                >
                  {days} working {days === 1 ? 'day' : 'days'}
                </span>
              </div>
              {overlaps.length > 0 && (
                <div
                  className="flex items-start gap-2 text-xs rounded-lg px-3 py-2.5"
                  style={{ backgroundColor: 'rgba(232,165,90,0.12)', color: '#9a6b2a' }}
                >
                  <span className="font-semibold shrink-0">⚠</span>
                  <span>
                    Team {overlaps.length === 1 ? 'member' : 'members'}{' '}
                    <span className="font-medium">{overlaps.join(', ')}</span>{' '}
                    {overlaps.length === 1 ? 'is' : 'are'} also on leave during this period.
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Reason */}
          <div>
            <label htmlFor="leave-reason" className="text-xs font-medium text-[#3d3d3a] block mb-1.5">
              Reason
            </label>
            <textarea
              id="leave-reason"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Brief reason for leave..."
              className="w-full px-3 py-2 rounded-lg border text-sm text-[#3d3d3a] placeholder:text-[#8e8b82] outline-none focus:ring-1 resize-none"
              style={{ borderColor: '#e6dfd8' }}
            />
          </div>

          {/* Medical certificate (Sick Leave only) */}
          {isSickLeave && (
            <div>
              <label className="text-xs font-medium text-[#3d3d3a] block mb-1.5">
                Medical Certificate
              </label>
              <label
                htmlFor="leave-cert"
                className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-5 cursor-pointer transition-colors hover:border-[#cc785c]/50 hover:bg-[#faf9f5]"
                style={{ borderColor: '#e6dfd8' }}
              >
                {fileName ? (
                  <div className="flex items-center gap-2 text-sm text-[#cc785c]">
                    <Paperclip className="w-4 h-4" />
                    <span className="font-medium truncate max-w-[280px]">{fileName}</span>
                  </div>
                ) : (
                  <>
                    <Upload className="w-5 h-5 text-[#8e8b82] mb-1.5" />
                    <p className="text-sm text-[#8e8b82]">Click to upload or drag and drop</p>
                    <p className="text-[10px] text-[#c0bbb5] mt-0.5">PDF, JPG, PNG up to 5MB</p>
                  </>
                )}
                <input
                  id="leave-cert"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (f) setFileName(f.name)
                  }}
                />
              </label>
            </div>
          )}

          {/* Notify manager toggle */}
          <div className="flex items-center gap-3 py-1">
            <Switch
              id="notify-manager"
              checked={notifyManager}
              onCheckedChange={setNotifyManager}
            />
            <label
              htmlFor="notify-manager"
              className="text-sm text-[#3d3d3a] cursor-pointer select-none"
            >
              Notify manager via email
            </label>
          </div>

        </div>

        <DialogFooter className="gap-2 pt-2 border-t border-[#f0ebe3]">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium border rounded-lg cursor-pointer transition-colors hover:bg-[#f5f0e8]"
            style={{ borderColor: '#e6dfd8', color: '#6c6a64' }}
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!fromDate || !toDate || !leaveType}
            className="px-5 py-2 text-sm font-medium rounded-lg text-white cursor-pointer transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#cc785c' }}
          >
            Submit Request
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
