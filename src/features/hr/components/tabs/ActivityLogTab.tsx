import type { ActivityEntry, ActivityType } from '../../types/employee.types'

// ─── Mock data ────────────────────────────────────────────────────────────────

const ACTIVITY_LOG: ActivityEntry[] = [
  { id: '1', action: 'Updated personal email address',             actor: 'Nguyễn Văn An',   timestamp: '26 May 2025, 09:45', type: 'edit'     },
  { id: '2', action: 'Leave request approved — 13–15 May 2025',   actor: 'Tống Minh Long',   timestamp: '12 May 2025, 14:20', type: 'approved' },
  { id: '3', action: 'Annual leave requested — 13–15 May 2025',   actor: 'Nguyễn Văn An',   timestamp: '11 May 2025, 10:30', type: 'leave'    },
  { id: '4', action: 'Work location changed to Hybrid',            actor: 'HR Manager',       timestamp: '01 Apr 2025, 08:00', type: 'edit'     },
  { id: '5', action: 'Salary grade updated to Grade 4',            actor: 'HR Manager',       timestamp: '15 Jan 2025, 09:00', type: 'approved' },
  { id: '6', action: 'Late check-in recorded — 21 Mar 2025',      actor: 'System',           timestamp: '21 Mar 2025, 09:15', type: 'warning'  },
  { id: '7', action: 'MacBook Pro 14" assigned to employee',       actor: 'IT Admin',         timestamp: '20 Jan 2022, 10:00', type: 'approved' },
  { id: '8', action: 'Employee profile created',                   actor: 'HR Admin',         timestamp: '15 Jan 2022, 08:00', type: 'edit'     },
]

// ─── Style maps ───────────────────────────────────────────────────────────────

const DOT_COLOR: Record<ActivityType, string> = {
  edit:     'bg-[#cc785c]',
  approved: 'bg-[#5db872]',
  leave:    'bg-[#e8a55a]',
  warning:  'bg-[#c64545]',
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ActivityLogTab() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-sm font-semibold text-[#141413] mb-6">Activity Timeline</h3>

      <div className="relative">
        {/* Vertical connector line */}
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[#e6dfd8]" aria-hidden="true" />

        <ol className="space-y-6">
          {ACTIVITY_LOG.map((entry, index) => (
            <li key={entry.id} className="relative flex gap-4">
              {/* Dot */}
              <span
                className={`relative z-10 flex-shrink-0 w-3.5 h-3.5 rounded-full mt-0.5 border-2 border-white shadow-sm ${DOT_COLOR[entry.type]}`}
                aria-hidden="true"
              />

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#3d3d3a]">
                  {entry.action}
                  {' — '}
                  <span className="font-medium text-[#141413]">{entry.actor}</span>
                </p>
                <p className="text-xs text-[#8e8b82] mt-0.5">{entry.timestamp}</p>
              </div>

              {/* Separator (not last) */}
              {index < ACTIVITY_LOG.length - 1 && (
                <span className="sr-only">followed by</span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
