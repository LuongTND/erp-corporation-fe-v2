import type { ActivityEntry, ActivityType } from '../../types/employee.types'

// ─── Mock data ────────────────────────────────────────────────────────────────

const ACTIVITY_LOG: ActivityEntry[] = [
  { id: '1', action: 'Cập nhật email cá nhân',                    actor: 'Nguyễn Văn An',   timestamp: '26/05/2025, 09:45', type: 'edit'     },
  { id: '2', action: 'Đơn nghỉ phép được duyệt — 13–15/05/2025',  actor: 'Tống Minh Long',   timestamp: '12/05/2025, 14:20', type: 'approved' },
  { id: '3', action: 'Yêu cầu nghỉ phép — 13–15/05/2025',         actor: 'Nguyễn Văn An',   timestamp: '11/05/2025, 10:30', type: 'leave'    },
  { id: '4', action: 'Hình thức làm việc đổi sang Kết hợp',       actor: 'Quản lý HR',       timestamp: '01/04/2025, 08:00', type: 'edit'     },
  { id: '5', action: 'Bậc lương cập nhật lên Bậc 4',              actor: 'Quản lý HR',       timestamp: '15/01/2025, 09:00', type: 'approved' },
  { id: '6', action: 'Ghi nhận đi trễ — 21/03/2025',              actor: 'Hệ thống',         timestamp: '21/03/2025, 09:15', type: 'warning'  },
  { id: '7', action: 'MacBook Pro 14" được cấp cho nhân viên',     actor: 'IT Admin',         timestamp: '20/01/2022, 10:00', type: 'approved' },
  { id: '8', action: 'Hồ sơ nhân viên được tạo',                  actor: 'Admin HR',         timestamp: '15/01/2022, 08:00', type: 'edit'     },
]

// ─── Style maps ───────────────────────────────────────────────────────────────

const DOT_COLOR: Record<ActivityType, string> = {
  edit:     'bg-primary',
  approved: 'bg-green-500',
  leave:    'bg-amber-400',
  warning:  'bg-destructive',
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ActivityLogTab() {
  return (
    <div className="bg-card rounded-xl shadow-sm p-6">
      <h3 className="text-sm font-semibold text-foreground mb-6">Nhật ký hoạt động</h3>

      <div className="relative">
        {/* Vertical connector line */}
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" aria-hidden="true" />

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
                <p className="text-sm text-foreground">
                  {entry.action}
                  {' — '}
                  <span className="font-medium text-foreground">{entry.actor}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{entry.timestamp}</p>
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
