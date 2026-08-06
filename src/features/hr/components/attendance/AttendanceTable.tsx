import { useState } from 'react'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  Pagination, PaginationContent, PaginationItem, PaginationLink,
  PaginationNext, PaginationPrevious,
} from '@/components/ui/pagination'
import type { AttendanceStatus, DailyAttendanceRecord } from '../../types/attendance.types'

// ─── Mock data ────────────────────────────────────────────────────────────────

const RECORDS: DailyAttendanceRecord[] = [
  { id: '1', employee: { id: 'EMP-0042', name: 'Nguyễn Văn An',   initials: 'NVA' }, department: 'Product',   checkIn: '08:02', checkOut: '17:15', workingHours: 9.2,  status: 'On Time', note: '' },
  { id: '2', employee: { id: 'EMP-0017', name: 'Trần Thị Bích',   initials: 'TTB' }, department: 'Engineering', checkIn: '08:27', checkOut: '17:30', workingHours: 9.0,  status: 'Late',    lateMinutes: 12, note: 'Kẹt xe' },
  { id: '3', employee: { id: 'EMP-0031', name: 'Lê Minh Dũng',    initials: 'LMD' }, department: 'Design',    checkIn: '08:00', checkOut: '17:00', workingHours: 9.0,  status: 'WFH',     note: 'Làm tại nhà' },
  { id: '4', employee: { id: 'EMP-0058', name: 'Phạm Hải Yến',    initials: 'PHY' }, department: 'HR',        checkIn: null,    checkOut: null,    workingHours: 0,    status: 'Absent',  note: 'Không thông báo' },
  { id: '5', employee: { id: 'EMP-0023', name: 'Hoàng Thanh Tú',  initials: 'HTT' }, department: 'Finance',   checkIn: null,    checkOut: null,    workingHours: 0,    status: 'Leave',   note: 'Nghỉ phép năm' },
  { id: '6', employee: { id: 'EMP-0009', name: 'Vũ Quốc Hùng',    initials: 'VQH' }, department: 'Engineering', checkIn: '07:55', checkOut: '18:45', workingHours: 10.8, status: 'On Time', note: '' },
  { id: '7', employee: { id: 'EMP-0044', name: 'Đặng Thị Mai',    initials: 'ĐTM' }, department: 'Product',   checkIn: '08:45', checkOut: '17:30', workingHours: 8.7,  status: 'Late',    lateMinutes: 30, note: '' },
  { id: '8', employee: { id: 'EMP-0062', name: 'Bùi Tuấn Kiệt',   initials: 'BTK' }, department: 'Sales',     checkIn: '08:05', checkOut: '17:10', workingHours: 9.1,  status: 'On Time', note: '' },
]

// ─── Style maps ───────────────────────────────────────────────────────────────

const STATUS_BADGE: Record<AttendanceStatus, string> = {
  'On Time': 'bg-green-500/12 dark:bg-green-500/20 text-green-700 dark:text-green-400',
  'Late':    'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  'Absent':  'bg-destructive/12 text-destructive',
  'Leave':   'bg-teal-500/15 text-teal-700 dark:text-teal-400',
  'WFH':     'bg-blue-100 text-blue-700',
}

const FILTER_TABS: { label: string; value: AttendanceStatus | 'All' }[] = [
  { label: 'Tất cả',    value: 'All'     },
  { label: 'Có mặt',   value: 'On Time' },
  { label: 'Trễ',      value: 'Late'    },
  { label: 'Vắng',     value: 'Absent'  },
  { label: 'Nghỉ phép', value: 'Leave'  },
]

const STATUS_LABELS: Record<AttendanceStatus, string> = {
  'On Time': 'Đúng giờ',
  'Late':    'Trễ',
  'Absent':  'Vắng',
  'Leave':   'Nghỉ phép',
  'WFH':     'WFH',
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function WorkingHoursCell({ hours }: { hours: number }) {
  const pct = Math.min((hours / 8) * 100, 100)
  return (
    <div>
      <span className="text-sm font-mono text-foreground">
        {hours > 0 ? `${hours.toFixed(1)}h` : '—'}
      </span>
      {hours > 0 && (
        <div className="w-16 h-1 rounded-full bg-muted mt-1">
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AttendanceTable() {
  const [activeFilter, setActiveFilter] = useState<AttendanceStatus | 'All'>('All')
  const [page, setPage] = useState(1)

  const filtered = activeFilter === 'All'
    ? RECORDS
    : RECORDS.filter((r) => r.status === activeFilter)

  const pageSize = 6
  const totalPages = Math.ceil(filtered.length / pageSize)
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div className="bg-card rounded-xl shadow-sm overflow-hidden">
      {/* Filter tabs */}
      <div className="flex items-center gap-1.5 px-5 pt-4 pb-3 border-b border-border flex-wrap">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => { setActiveFilter(tab.value); setPage(1) }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
              activeFilter === tab.value
                ? 'bg-primary text-white'
                : 'bg-card border border-border text-muted-foreground hover:bg-muted/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow className="border-border">
            <TableHead className="text-xs font-medium text-muted-foreground pl-5">Nhân viên</TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground">Phòng ban</TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground">Giờ vào</TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground">Giờ ra</TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground">Giờ làm</TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground">Trạng thái</TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground">Ghi chú</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paged.map((record) => (
            <TableRow
              key={record.id}
              className={`border-border ${record.status === 'Absent' ? 'bg-destructive/5' : ''}`}
            >
              {/* Employee */}
              <TableCell className="pl-5 py-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold bg-primary/15 text-primary shrink-0">
                    {record.employee.initials}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground leading-tight">{record.employee.name}</p>
                    <p className="text-xs font-mono text-muted-foreground">{record.employee.id}</p>
                  </div>
                </div>
              </TableCell>

              {/* Department */}
              <TableCell className="text-sm text-muted-foreground">{record.department}</TableCell>

              {/* Check-in */}
              <TableCell className="font-mono text-sm text-foreground">
                {record.checkIn ?? <span className="text-muted-foreground">—</span>}
              </TableCell>

              {/* Check-out */}
              <TableCell className="font-mono text-sm text-foreground">
                {record.checkOut ?? <span className="text-muted-foreground">—</span>}
              </TableCell>

              {/* Working hours */}
              <TableCell>
                <WorkingHoursCell hours={record.workingHours} />
              </TableCell>

              {/* Status */}
              <TableCell>
                <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_BADGE[record.status]}`}>
                  {STATUS_LABELS[record.status]}
                  {record.status === 'Late' && record.lateMinutes && (
                    <span className="font-normal opacity-75">+{record.lateMinutes}m</span>
                  )}
                </span>
              </TableCell>

              {/* Note */}
              <TableCell className="text-xs text-muted-foreground italic max-w-[120px] truncate">
                {record.note || '—'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-5 py-3 border-t border-border">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => { e.preventDefault(); setPage((p) => Math.max(1, p - 1)) }}
                  className={page === 1 ? 'pointer-events-none opacity-40' : 'cursor-pointer'}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => (
                <PaginationItem key={i + 1}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => { e.preventDefault(); setPage(i + 1) }}
                    isActive={page === i + 1}
                    className="cursor-pointer"
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => { e.preventDefault(); setPage((p) => Math.min(totalPages, p + 1)) }}
                  className={page === totalPages ? 'pointer-events-none opacity-40' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}
