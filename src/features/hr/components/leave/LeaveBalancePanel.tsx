import { useState } from 'react'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import type { LeaveType, EmployeeBalance } from '../../types/leave.types'

// ─── Mock data ────────────────────────────────────────────────────────────────

const BALANCES: EmployeeBalance[] = [
  {
    employeeId: 'me',
    employeeName: 'My Balance (Nguyễn Văn An)',
    balances: [
      { type: 'Annual Leave',  used: 4,  total: 12 },
      { type: 'Sick Leave',    used: 1,  total: 10 },
      { type: 'Paternity',     used: 5,  total: 5  },
      { type: 'WFH',           used: 0,  total: null, unlimited: true },
      { type: 'Compassionate', used: 0,  total: 3  },
      { type: 'Unpaid Leave',  used: 0,  total: null },
    ],
  },
  {
    employeeId: 'EMP-0017',
    employeeName: 'Trần Thị Bích',
    balances: [
      { type: 'Annual Leave',  used: 2,  total: 12 },
      { type: 'Sick Leave',    used: 3,  total: 10 },
      { type: 'Maternity',     used: 0,  total: 180 },
      { type: 'WFH',           used: 0,  total: null, unlimited: true },
      { type: 'Compassionate', used: 0,  total: 3  },
      { type: 'Unpaid Leave',  used: 0,  total: null },
    ],
  },
  {
    employeeId: 'EMP-0031',
    employeeName: 'Lê Minh Dũng',
    balances: [
      { type: 'Annual Leave',  used: 7,  total: 12 },
      { type: 'Sick Leave',    used: 0,  total: 10 },
      { type: 'Paternity',     used: 0,  total: 5  },
      { type: 'WFH',           used: 6,  total: null, unlimited: true },
      { type: 'Compassionate', used: 0,  total: 3  },
      { type: 'Unpaid Leave',  used: 2,  total: null },
    ],
  },
  {
    employeeId: 'EMP-0058',
    employeeName: 'Phạm Hải Yến',
    balances: [
      { type: 'Annual Leave',  used: 5,  total: 12 },
      { type: 'Sick Leave',    used: 2,  total: 10 },
      { type: 'Maternity',     used: 180, total: 180 },
      { type: 'WFH',           used: 0,  total: null, unlimited: true },
      { type: 'Compassionate', used: 1,  total: 3  },
      { type: 'Unpaid Leave',  used: 0,  total: null },
    ],
  },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

const TYPE_FILL: Record<LeaveType, string> = {
  'Annual Leave':  '#cc785c',
  'Sick Leave':    '#c64545',
  'Maternity':     '#5db8a6',
  'Paternity':     '#5db8a6',
  'Unpaid Leave':  '#8e8b82',
  'WFH':           '#5db872',
  'Compassionate': '#e8a55a',
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  onRequestLeave: () => void
}

export function LeaveBalancePanel({ onRequestLeave }: Props) {
  const [selectedId, setSelectedId] = useState('me')

  const employee = BALANCES.find((e) => e.employeeId === selectedId) ?? BALANCES[0]

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[#141413]">Leave Balances — 2025</h3>
      </div>

      {/* Employee selector */}
      <Select value={selectedId} onValueChange={setSelectedId}>
        <SelectTrigger
          className="w-full h-8 text-xs border rounded-lg mb-4 cursor-pointer"
          style={{ borderColor: '#e6dfd8', color: '#3d3d3a' }}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {BALANCES.map((e) => (
            <SelectItem key={e.employeeId} value={e.employeeId} className="text-xs cursor-pointer">
              {e.employeeName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Balance list */}
      <div className="flex-1 space-y-0 divide-y divide-[#f0ebe3]">
        {employee.balances.map((b) => {
          const pct = b.unlimited || b.total == null ? null
            : Math.min((b.used / b.total) * 100, 100)
          const remaining = b.unlimited ? null
            : b.total == null ? null
            : b.total - b.used
          const fill = TYPE_FILL[b.type]

          return (
            <div key={b.type} className="py-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-[#3d3d3a]">{b.type}</span>
                {b.unlimited ? (
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-[#e6f5ea] text-[#2d7a40]">
                    Unlimited
                  </span>
                ) : b.total == null ? (
                  <span className="text-xs text-[#8e8b82]">By request</span>
                ) : (
                  <span className="text-xs text-[#6c6a64]">
                    <span className="font-semibold text-[#3d3d3a]">{b.used}</span>
                    {' / '}
                    {b.total} days
                  </span>
                )}
              </div>

              {pct != null && (
                <>
                  <div className="w-full bg-[#f0ebe3] rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-1.5 rounded-full transition-all"
                      style={{ width: `${pct}%`, backgroundColor: fill }}
                    />
                  </div>
                  <p className="text-[10px] mt-1" style={{ color: '#8e8b82' }}>
                    Remaining: <span className="font-medium" style={{ color: fill }}>{remaining} days</span>
                  </p>
                </>
              )}

              {b.unlimited && (
                <div className="w-full bg-[#e6f5ea] rounded-full h-1.5 overflow-hidden mt-1">
                  <div className="h-1.5 rounded-full bg-[#5db872] w-full opacity-30" />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* CTA */}
      <button
        type="button"
        onClick={onRequestLeave}
        className="w-full mt-4 py-2.5 rounded-lg text-sm font-medium text-white cursor-pointer transition-opacity hover:opacity-90"
        style={{ backgroundColor: '#cc785c' }}
      >
        Request Leave
      </button>
    </div>
  )
}
