import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from '@/components/ui/tooltip'
import type { CalendarDayData } from '../../types/attendance.types'

// ─── Mock data — May 2025 ─────────────────────────────────────────────────────

const TODAY = 26 // May 26 2025
const WEEKENDS = new Set([3, 4, 10, 11, 17, 18, 24, 25, 31])

const MAY_2025: CalendarDayData[] = Array.from({ length: 31 }, (_, i) => {
  const date = i + 1
  const isWeekend = WEEKENDS.has(date)
  const isToday = date === TODAY

  let attendanceRate = 0
  let present = 0, absent = 0, onLeave = 0
  if (!isWeekend) {
    attendanceRate = date < TODAY
      ? 70 + Math.round(Math.sin(date * 1.7) * 20 + Math.random() * 10)
      : date === TODAY ? 88 : 0
    attendanceRate = Math.max(0, Math.min(100, attendanceRate))
    const total = 134
    present = Math.round(total * attendanceRate / 100)
    absent = Math.round(total * 0.03)
    onLeave = total - present - absent
    if (date >= TODAY && date !== TODAY) { present = 0; absent = 0; onLeave = 0; attendanceRate = 0 }
  }

  return { date, attendanceRate, present, absent, onLeave, isWeekend, isToday }
})

// ─── Helpers ──────────────────────────────────────────────────────────────────

function dayColor(day: CalendarDayData): string {
  if (day.isWeekend) return 'bg-muted/50 text-muted-foreground'
  if (day.attendanceRate === 0) return 'bg-muted text-muted-foreground'
  if (day.attendanceRate >= 95) return 'bg-[#5db872] text-white'
  if (day.attendanceRate >= 80) return 'bg-[#86c993] text-white'
  if (day.attendanceRate >= 60) return 'bg-[#e8a55a] text-white'
  return 'bg-[#c64545] text-white'
}

// May 2025 starts on Thursday → offset = 4 (Sun=0)
const START_OFFSET = 4

// ─── Component ────────────────────────────────────────────────────────────────

export function AttendanceCalendarHeatmap() {
  const [monthLabel] = useState('May 2025')

  // Pad front with empty cells
  const cells: (CalendarDayData | null)[] = [
    ...Array(START_OFFSET).fill(null),
    ...MAY_2025,
  ]
  // Pad end to complete last week row
  while (cells.length % 7 !== 0) cells.push(null)

  const DOW = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

  return (
    <div className="bg-card rounded-xl shadow-sm p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-foreground">{monthLabel}</span>
        <div className="flex items-center gap-1">
          <button type="button" className="p-1 rounded hover:bg-muted/50 transition-colors cursor-pointer">
            <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          </button>
          <button type="button" className="p-1 rounded hover:bg-muted/50 transition-colors cursor-pointer">
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 mb-1">
        {DOW.map((d, i) => (
          <div key={i} className="flex items-center justify-center text-[10px] font-medium text-muted-foreground h-6">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <TooltipProvider delayDuration={100}>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, i) => {
            if (!day) return <div key={`empty-${i}`} className="w-full aspect-square" />

            return (
              <Tooltip key={day.date}>
                <TooltipTrigger asChild>
                  <div
                    className={`flex items-center justify-center rounded-lg text-[11px] font-medium w-full aspect-square cursor-default transition-opacity hover:opacity-80 ${dayColor(day)} ${
                      day.isToday ? 'ring-2 ring-primary ring-offset-1' : ''
                    }`}
                  >
                    {day.date}
                  </div>
                </TooltipTrigger>
                {!day.isWeekend && day.attendanceRate > 0 && (
                  <TooltipContent side="top" className="text-xs">
                    <p className="font-medium mb-0.5">May {day.date}</p>
                    <p>Present: <span className="font-medium text-green-700 dark:text-green-400">{day.present}</span></p>
                    <p>Absent: <span className="font-medium text-destructive">{day.absent}</span></p>
                    <p>On Leave: <span className="font-medium text-teal-700 dark:text-teal-400">{day.onLeave}</span></p>
                    <p className="mt-0.5 text-muted-foreground">Rate: {day.attendanceRate}%</p>
                  </TooltipContent>
                )}
              </Tooltip>
            )
          })}
        </div>
      </TooltipProvider>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-4 pt-4 border-t border-border">
        {[
          { color: 'bg-[#5db872]',  label: '≥95%'    },
          { color: 'bg-[#86c993]',  label: '80–94%'  },
          { color: 'bg-[#e8a55a]',  label: '60–79%'  },
          { color: 'bg-[#c64545]',  label: '<60%'    },
          { color: 'bg-muted/50',   label: 'Weekend' },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1">
            <span className={`w-2.5 h-2.5 rounded-sm ${item.color}`} />
            <span className="text-[10px] text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
