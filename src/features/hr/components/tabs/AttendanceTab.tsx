import { useState } from 'react'
import { ExternalLink } from 'lucide-react'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import type { AttendanceRecord, AttendanceStatus } from '../../types/employee.types'

// ─── Types ────────────────────────────────────────────────────────────────────

type CalendarDayStatus = AttendanceStatus | 'empty'

interface CalendarDay {
  day: number | null
  status: CalendarDayStatus
}

// ─── Mock data — May 2025 (May 1 = Thursday) ─────────────────────────────────

const MAY_2025_CALENDAR: CalendarDay[] = [
  // Week 1 (Mon–Sun): blanks before May 1 (Thursday)
  { day: null, status: 'empty' }, { day: null, status: 'empty' },
  { day: null, status: 'empty' },
  { day: 1,    status: 'Present' }, { day: 2, status: 'Present' },
  { day: 3,    status: 'Weekend' }, { day: 4, status: 'Weekend' },
  // Week 2
  { day: 5,    status: 'Present' }, { day: 6,  status: 'Present'  },
  { day: 7,    status: 'Present' }, { day: 8,  status: 'Present'  },
  { day: 9,    status: 'Present' }, { day: 10, status: 'Weekend'  },
  { day: 11,   status: 'Weekend' },
  // Week 3 — leave 13–15
  { day: 12,   status: 'Present' }, { day: 13, status: 'Leave'    },
  { day: 14,   status: 'Leave'   }, { day: 15, status: 'Leave'    },
  { day: 16,   status: 'Present' }, { day: 17, status: 'Weekend'  },
  { day: 18,   status: 'Weekend' },
  // Week 4 — late 21
  { day: 19,   status: 'Present' }, { day: 20, status: 'Present'  },
  { day: 21,   status: 'Late'    }, { day: 22, status: 'Present'  },
  { day: 23,   status: 'Present' }, { day: 24, status: 'Weekend'  },
  { day: 25,   status: 'Weekend' },
  // Week 5 — absent 28
  { day: 26,   status: 'Present' }, { day: 27, status: 'Present'  },
  { day: 28,   status: 'Absent'  }, { day: 29, status: 'Present'  },
  { day: 30,   status: 'Present' }, { day: 31, status: 'Weekend'  },
  { day: null, status: 'empty'   },
]

const ATTENDANCE_RECORDS: AttendanceRecord[] = [
  { date: '30 May 2025', checkIn: '08:03', checkOut: '17:15', hours: '9h 12m', status: 'Present', note: '' },
  { date: '29 May 2025', checkIn: '07:58', checkOut: '17:02', hours: '9h 04m', status: 'Present', note: '' },
  { date: '28 May 2025', checkIn: '—',     checkOut: '—',     hours: '—',      status: 'Absent',  note: 'Not reported' },
  { date: '27 May 2025', checkIn: '08:01', checkOut: '17:00', hours: '8h 59m', status: 'Present', note: '' },
  { date: '26 May 2025', checkIn: '08:47', checkOut: '17:10', hours: '8h 23m', status: 'Late',    note: 'Traffic' },
  { date: '23 May 2025', checkIn: '08:00', checkOut: '17:00', hours: '9h 00m', status: 'Present', note: '' },
  { date: '22 May 2025', checkIn: '08:02', checkOut: '17:05', hours: '9h 03m', status: 'Present', note: '' },
  { date: '21 May 2025', checkIn: '08:52', checkOut: '17:00', hours: '8h 08m', status: 'Late',    note: '' },
  { date: '20 May 2025', checkIn: '07:55', checkOut: '17:00', hours: '9h 05m', status: 'Present', note: '' },
  { date: '19 May 2025', checkIn: '08:00', checkOut: '17:00', hours: '9h 00m', status: 'Present', note: '' },
]

// ─── Style maps ───────────────────────────────────────────────────────────────

const DAY_BG: Record<CalendarDayStatus, string> = {
  Present: 'bg-[#cc785c] text-white',
  Late:    'bg-[#e8a55a] text-white',
  Absent:  'bg-[#c64545] text-white',
  Leave:   'bg-[#5db8a6] text-white',
  Weekend: 'bg-[#efe9de] text-[#8e8b82]',
  empty:   'bg-transparent',
}

const STATUS_BADGE: Record<AttendanceStatus, string> = {
  Present: 'bg-[#5db872]/10 text-[#2d7a40]',
  Late:    'bg-[#d4a017]/10 text-[#8a6610]',
  Absent:  'bg-[#c64545]/10 text-[#c64545]',
  Leave:   'bg-[#5db8a6]/10 text-[#357a70]',
  Weekend: 'bg-[#efe9de] text-[#6c6a64]',
}

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

// ─── Component ────────────────────────────────────────────────────────────────

export function AttendanceTab() {
  const [month, setMonth] = useState('may-2025')

  return (
    <div className="space-y-6">
      {/* Calendar card */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-semibold text-[#141413]">Attendance Calendar</h3>
          <div className="flex items-center gap-3">
            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger className="h-8 w-36 text-xs border-[#e6dfd8]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="may-2025">May 2025</SelectItem>
                <SelectItem value="apr-2025">Apr 2025</SelectItem>
                <SelectItem value="mar-2025">Mar 2025</SelectItem>
              </SelectContent>
            </Select>
            <a
              href="/hr/attendance"
              className="inline-flex items-center gap-1 text-xs text-[#cc785c] hover:text-[#a9583e] transition-colors"
            >
              Full report
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Day-of-week headers */}
        <div className="grid grid-cols-7 gap-1.5 mb-1.5">
          {WEEK_DAYS.map((d) => (
            <div key={d} className="text-center text-[10px] font-semibold uppercase tracking-wide text-[#8e8b82]">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1.5">
          {MAY_2025_CALENDAR.map((cell, index) => (
            <div
              key={index}
              className={`w-full aspect-square rounded-md flex items-center justify-center text-xs font-medium ${DAY_BG[cell.status]}`}
            >
              {cell.day ?? ''}
            </div>
          ))}
        </div>

        {/* Summary pills */}
        <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-[#e6dfd8]">
          {[
            { label: 'Present', count: 20, bg: 'bg-[#cc785c]/10 text-[#a9583e]' },
            { label: 'Late',    count: 2,  bg: 'bg-[#e8a55a]/10 text-[#9a6b2a]' },
            { label: 'Absent',  count: 1,  bg: 'bg-[#c64545]/10 text-[#c64545]' },
            { label: 'Leave',   count: 3,  bg: 'bg-[#5db8a6]/10 text-[#357a70]' },
          ].map((stat) => (
            <span
              key={stat.label}
              className={`inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full ${stat.bg}`}
            >
              {stat.label} <strong>{stat.count}d</strong>
            </span>
          ))}
        </div>
      </div>

      {/* Recent records table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#e6dfd8]">
          <h3 className="text-sm font-semibold text-[#141413]">Recent Records</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-[#faf9f5] hover:bg-[#faf9f5]">
              <TableHead className="text-xs font-semibold uppercase tracking-wide text-[#6c6a64]">Date</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide text-[#6c6a64]">Check-in</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide text-[#6c6a64]">Check-out</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide text-[#6c6a64]">Hours</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide text-[#6c6a64]">Status</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide text-[#6c6a64]">Note</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ATTENDANCE_RECORDS.map((record) => (
              <TableRow key={record.date} className="hover:bg-[#faf9f5]">
                <TableCell className="text-sm text-[#141413] font-medium">{record.date}</TableCell>
                <TableCell className="text-sm text-[#3d3d3a] font-mono">{record.checkIn}</TableCell>
                <TableCell className="text-sm text-[#3d3d3a] font-mono">{record.checkOut}</TableCell>
                <TableCell className="text-sm text-[#3d3d3a] font-mono">{record.hours}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_BADGE[record.status]}`}>
                    {record.status}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-[#6c6a64]">{record.note || '—'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
