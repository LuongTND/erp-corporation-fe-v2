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
  { id: '2', employee: { id: 'EMP-0017', name: 'Trần Thị Bích',   initials: 'TTB' }, department: 'Engineering', checkIn: '08:27', checkOut: '17:30', workingHours: 9.0,  status: 'Late',    lateMinutes: 12, note: 'Traffic jam' },
  { id: '3', employee: { id: 'EMP-0031', name: 'Lê Minh Dũng',    initials: 'LMD' }, department: 'Design',    checkIn: '08:00', checkOut: '17:00', workingHours: 9.0,  status: 'WFH',     note: 'Work from home' },
  { id: '4', employee: { id: 'EMP-0058', name: 'Phạm Hải Yến',    initials: 'PHY' }, department: 'HR',        checkIn: null,    checkOut: null,    workingHours: 0,    status: 'Absent',  note: 'No notice' },
  { id: '5', employee: { id: 'EMP-0023', name: 'Hoàng Thanh Tú',  initials: 'HTT' }, department: 'Finance',   checkIn: null,    checkOut: null,    workingHours: 0,    status: 'Leave',   note: 'Annual leave' },
  { id: '6', employee: { id: 'EMP-0009', name: 'Vũ Quốc Hùng',    initials: 'VQH' }, department: 'Engineering', checkIn: '07:55', checkOut: '18:45', workingHours: 10.8, status: 'On Time', note: '' },
  { id: '7', employee: { id: 'EMP-0044', name: 'Đặng Thị Mai',    initials: 'ĐTM' }, department: 'Product',   checkIn: '08:45', checkOut: '17:30', workingHours: 8.7,  status: 'Late',    lateMinutes: 30, note: '' },
  { id: '8', employee: { id: 'EMP-0062', name: 'Bùi Tuấn Kiệt',   initials: 'BTK' }, department: 'Sales',     checkIn: '08:05', checkOut: '17:10', workingHours: 9.1,  status: 'On Time', note: '' },
]

// ─── Style maps ───────────────────────────────────────────────────────────────

const STATUS_BADGE: Record<AttendanceStatus, string> = {
  'On Time': 'bg-[#5db872]/10 text-[#2d7a40]',
  'Late':    'bg-[#e8a55a]/10 text-[#9a6b2a]',
  'Absent':  'bg-[#c64545]/10 text-[#c64545]',
  'Leave':   'bg-[#5db8a6]/10 text-[#357a70]',
  'WFH':     'bg-blue-100 text-blue-700',
}

const FILTER_TABS: { label: string; value: AttendanceStatus | 'All' }[] = [
  { label: 'All',     value: 'All'     },
  { label: 'Present', value: 'On Time' },
  { label: 'Late',    value: 'Late'    },
  { label: 'Absent',  value: 'Absent'  },
  { label: 'Leave',   value: 'Leave'   },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function WorkingHoursCell({ hours }: { hours: number }) {
  const pct = Math.min((hours / 8) * 100, 100)
  return (
    <div>
      <span className="text-sm font-mono text-[#3d3d3a]">
        {hours > 0 ? `${hours.toFixed(1)}h` : '—'}
      </span>
      {hours > 0 && (
        <div className="w-16 h-1 rounded-full bg-[#efe9de] mt-1">
          <div
            className="h-full rounded-full bg-[#cc785c]"
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
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Filter tabs */}
      <div className="flex items-center gap-1.5 px-5 pt-4 pb-3 border-b border-[#f0ebe3] flex-wrap">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => { setActiveFilter(tab.value); setPage(1) }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
              activeFilter === tab.value
                ? 'bg-[#cc785c] text-white'
                : 'bg-white border border-[#e6dfd8] text-[#6c6a64] hover:bg-[#f5f0e8]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow className="border-[#f0ebe3]">
            <TableHead className="text-xs font-medium text-[#8e8b82] pl-5">Employee</TableHead>
            <TableHead className="text-xs font-medium text-[#8e8b82]">Department</TableHead>
            <TableHead className="text-xs font-medium text-[#8e8b82]">Check-in</TableHead>
            <TableHead className="text-xs font-medium text-[#8e8b82]">Check-out</TableHead>
            <TableHead className="text-xs font-medium text-[#8e8b82]">Hours</TableHead>
            <TableHead className="text-xs font-medium text-[#8e8b82]">Status</TableHead>
            <TableHead className="text-xs font-medium text-[#8e8b82]">Note</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paged.map((record) => (
            <TableRow
              key={record.id}
              className={`border-[#f0ebe3] ${record.status === 'Absent' ? 'bg-red-50/60' : ''}`}
            >
              {/* Employee */}
              <TableCell className="pl-5 py-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold bg-[#cc785c]/15 text-[#a9583e] shrink-0">
                    {record.employee.initials}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#141413] leading-tight">{record.employee.name}</p>
                    <p className="text-xs font-mono text-[#8e8b82]">{record.employee.id}</p>
                  </div>
                </div>
              </TableCell>

              {/* Department */}
              <TableCell className="text-sm text-[#6c6a64]">{record.department}</TableCell>

              {/* Check-in */}
              <TableCell className="font-mono text-sm text-[#3d3d3a]">
                {record.checkIn ?? <span className="text-[#8e8b82]">—</span>}
              </TableCell>

              {/* Check-out */}
              <TableCell className="font-mono text-sm text-[#3d3d3a]">
                {record.checkOut ?? <span className="text-[#8e8b82]">—</span>}
              </TableCell>

              {/* Working hours */}
              <TableCell>
                <WorkingHoursCell hours={record.workingHours} />
              </TableCell>

              {/* Status */}
              <TableCell>
                <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_BADGE[record.status]}`}>
                  {record.status}
                  {record.status === 'Late' && record.lateMinutes && (
                    <span className="font-normal opacity-75">+{record.lateMinutes}m</span>
                  )}
                </span>
              </TableCell>

              {/* Note */}
              <TableCell className="text-xs text-[#8e8b82] italic max-w-[120px] truncate">
                {record.note || '—'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-5 py-3 border-t border-[#f0ebe3]">
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
