import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from '@/components/ui/tooltip'
import type { LeaveType } from '../../types/leave.types'

// ─── Calendar data (May 2025 — Mon-Sun layout) ───────────────────────────────

interface CalCell {
  label: string
  day: number | null   // May day number; null = prev/next month
  inMonth: boolean
  isWeekend: boolean
  isToday: boolean
}

const CELLS: CalCell[] = [
  // Week 1 — starts Apr 28 (Mon)
  { label: '28', day: null, inMonth: false, isWeekend: false, isToday: false },
  { label: '29', day: null, inMonth: false, isWeekend: false, isToday: false },
  { label: '30', day: null, inMonth: false, isWeekend: false, isToday: false },
  { label: '1',  day: 1,   inMonth: true,  isWeekend: false, isToday: false },
  { label: '2',  day: 2,   inMonth: true,  isWeekend: false, isToday: false },
  { label: '3',  day: 3,   inMonth: true,  isWeekend: true,  isToday: false },
  { label: '4',  day: 4,   inMonth: true,  isWeekend: true,  isToday: false },
  // Week 2
  { label: '5',  day: 5,   inMonth: true,  isWeekend: false, isToday: false },
  { label: '6',  day: 6,   inMonth: true,  isWeekend: false, isToday: false },
  { label: '7',  day: 7,   inMonth: true,  isWeekend: false, isToday: false },
  { label: '8',  day: 8,   inMonth: true,  isWeekend: false, isToday: false },
  { label: '9',  day: 9,   inMonth: true,  isWeekend: false, isToday: false },
  { label: '10', day: 10,  inMonth: true,  isWeekend: true,  isToday: false },
  { label: '11', day: 11,  inMonth: true,  isWeekend: true,  isToday: false },
  // Week 3
  { label: '12', day: 12,  inMonth: true,  isWeekend: false, isToday: false },
  { label: '13', day: 13,  inMonth: true,  isWeekend: false, isToday: false },
  { label: '14', day: 14,  inMonth: true,  isWeekend: false, isToday: false },
  { label: '15', day: 15,  inMonth: true,  isWeekend: false, isToday: false },
  { label: '16', day: 16,  inMonth: true,  isWeekend: false, isToday: false },
  { label: '17', day: 17,  inMonth: true,  isWeekend: true,  isToday: false },
  { label: '18', day: 18,  inMonth: true,  isWeekend: true,  isToday: false },
  // Week 4
  { label: '19', day: 19,  inMonth: true,  isWeekend: false, isToday: false },
  { label: '20', day: 20,  inMonth: true,  isWeekend: false, isToday: false },
  { label: '21', day: 21,  inMonth: true,  isWeekend: false, isToday: false },
  { label: '22', day: 22,  inMonth: true,  isWeekend: false, isToday: false },
  { label: '23', day: 23,  inMonth: true,  isWeekend: false, isToday: false },
  { label: '24', day: 24,  inMonth: true,  isWeekend: true,  isToday: false },
  { label: '25', day: 25,  inMonth: true,  isWeekend: true,  isToday: false },
  // Week 5
  { label: '26', day: 26,  inMonth: true,  isWeekend: false, isToday: true  },
  { label: '27', day: 27,  inMonth: true,  isWeekend: false, isToday: false },
  { label: '28', day: 28,  inMonth: true,  isWeekend: false, isToday: false },
  { label: '29', day: 29,  inMonth: true,  isWeekend: false, isToday: false },
  { label: '30', day: 30,  inMonth: true,  isWeekend: false, isToday: false },
  { label: '31', day: 31,  inMonth: true,  isWeekend: true,  isToday: false },
  { label: '1',  day: null, inMonth: false, isWeekend: true,  isToday: false },
]

interface CalEvent {
  name: string
  type: LeaveType
  dept: string
  from: number
  to: number
  color: string
  rangeLabel: string
}

const CAL_EVENTS: CalEvent[] = [
  { name: 'Nguyễn Văn An', type: 'Annual Leave',  dept: 'Engineering', from: 5,  to: 9,  color: '#cc785c', rangeLabel: 'May 5 – 9' },
  { name: 'Vũ Thị Lan',    type: 'WFH',           dept: 'Design',      from: 5,  to: 6,  color: '#5db872', rangeLabel: 'May 5 – 6' },
  { name: 'Hoàng Văn Tú',  type: 'Compassionate', dept: 'Finance',     from: 7,  to: 8,  color: '#e8a55a', rangeLabel: 'May 7 – 8' },
  { name: 'Trần Thị Bích', type: 'Sick Leave',    dept: 'Engineering', from: 12, to: 13, color: '#c64545', rangeLabel: 'May 12 – 13' },
  { name: 'Đặng Thị Mai',  type: 'Sick Leave',    dept: 'Product',     from: 14, to: 14, color: '#c64545', rangeLabel: 'May 14' },
  { name: 'Lê Minh Dũng',  type: 'WFH',           dept: 'Design',      from: 19, to: 26, color: '#5db872', rangeLabel: 'May 19 – 26' },
  { name: 'Bùi Minh Khoa', type: 'Annual Leave',  dept: 'Engineering', from: 20, to: 23, color: '#cc785c', rangeLabel: 'May 20 – 23' },
  { name: 'Phạm Hải Yến',  type: 'Annual Leave',  dept: 'HR',          from: 26, to: 30, color: '#cc785c', rangeLabel: 'May 26 – 30' },
  { name: 'Nguyễn Văn An', type: 'WFH',           dept: 'Engineering', from: 27, to: 28, color: '#5db872', rangeLabel: 'May 27 – 28' },
]

const DEPTS = ['All', 'Engineering', 'Design', 'Finance', 'HR', 'Product']
const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

// ─── Component ────────────────────────────────────────────────────────────────

export function LeaveCalendar() {
  const [deptFilter, setDeptFilter] = useState('All')

  const visibleEvents = (day: number | null): CalEvent[] => {
    if (day == null) return []
    return CAL_EVENTS.filter(
      (e) => day >= e.from && day <= e.to &&
             (deptFilter === 'All' || e.dept === deptFilter),
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">

      {/* Header row */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold text-[#141413]">
            Team Leave Calendar — May 2025
          </h3>
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[#f5f0e8] transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 text-[#6c6a64]" />
            </button>
            <button
              type="button"
              className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[#f5f0e8] transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 text-[#6c6a64]" />
            </button>
          </div>
        </div>

        {/* Department pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {DEPTS.map((dept) => (
            <button
              key={dept}
              type="button"
              onClick={() => setDeptFilter(dept)}
              className="px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer"
              style={
                deptFilter === dept
                  ? { backgroundColor: '#cc785c', color: '#fff' }
                  : { backgroundColor: '#f5f0e8', color: '#6c6a64' }
              }
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar grid */}
      <TooltipProvider delayDuration={150}>
        {/* Day headers */}
        <div className="grid grid-cols-7 mb-1">
          {DAYS_OF_WEEK.map((d) => (
            <div
              key={d}
              className="text-center text-[11px] font-medium py-2"
              style={{ color: d === 'Sat' || d === 'Sun' ? '#c64545' : '#8e8b82' }}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Cells */}
        <div className="grid grid-cols-7 border-l border-t border-[#f0ebe3]">
          {CELLS.map((cell, idx) => {
            const events = visibleEvents(cell.day)
            const shown  = events.slice(0, 3)
            const extra  = events.length - shown.length

            return (
              <div
                key={idx}
                className="border-r border-b border-[#f0ebe3] min-h-[96px] p-1.5 flex flex-col"
                style={{
                  backgroundColor: cell.isToday
                    ? 'rgba(204,120,92,0.05)'
                    : cell.isWeekend
                    ? '#faf9f5'
                    : cell.inMonth ? '#fff' : '#faf9f5',
                }}
              >
                {/* Day number */}
                <span
                  className={[
                    'text-xs leading-none mb-1 self-start',
                    cell.isToday
                      ? 'w-5 h-5 rounded-full flex items-center justify-center text-white font-bold text-[10px]'
                      : '',
                  ].join(' ')}
                  style={{
                    color: cell.isToday ? undefined
                      : cell.inMonth
                      ? cell.isWeekend ? '#c64545' : '#6c6a64'
                      : '#c0bbb5',
                    backgroundColor: cell.isToday ? '#cc785c' : undefined,
                  }}
                >
                  {cell.label}
                </span>

                {/* Event pills */}
                <div className="flex flex-col gap-0.5 flex-1">
                  {shown.map((ev, i) => (
                    <Tooltip key={i}>
                      <TooltipTrigger asChild>
                        <div
                          className="rounded px-1.5 py-px flex items-center cursor-pointer overflow-hidden"
                          style={{ backgroundColor: ev.color }}
                        >
                          <span className="text-[9px] text-white font-medium truncate leading-tight">
                            {ev.name.split(' ').slice(-1)[0]}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-[200px]">
                        <p className="font-semibold text-xs">{ev.name}</p>
                        <p className="text-[11px] opacity-80">{ev.type}</p>
                        <p className="text-[11px] opacity-70">{ev.rangeLabel}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                  {extra > 0 && (
                    <p className="text-[9px] text-[#8e8b82] pl-1">+{extra} more</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </TooltipProvider>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 flex-wrap">
        {[
          { label: 'Annual Leave',  color: '#cc785c' },
          { label: 'Sick Leave',    color: '#c64545' },
          { label: 'WFH',           color: '#5db872' },
          { label: 'Compassionate', color: '#e8a55a' },
          { label: 'Maternity',     color: '#5db8a6' },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
            <span className="text-[10px] text-[#8e8b82]">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
