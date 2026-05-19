import { useState, useMemo } from 'react'
import {
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isToday,
  parseISO,
} from 'date-fns'
import { vi } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Task } from '@/features/task/types/task.types'
import { useTaskActions } from '@/features/task/context/TaskActionsContext'

const C = {
  text: '#141413',
  muted: '#8e8b82',
  border: '#e6dfd8',
  accent: '#cc785c',
  bg: '#FFFFFF',
  bgPage: '#faf9f5',
} as const

const WEEK_DAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']

function priorityPillStyle(priority?: string): { bg: string; color: string } {
  const p = (priority ?? '').toLowerCase()
  if (p === 'urgent') return { bg: '#fee2e2', color: '#dc2626' }
  if (p === 'high')   return { bg: '#ffedd5', color: '#ea580c' }
  if (p === 'medium') return { bg: '#fef3c7', color: '#d97706' }
  return { bg: '#eff6ff', color: '#2563eb' }
}

interface TaskCalendarProps {
  tasks: Task[]
}

export function TaskCalendar({ tasks }: TaskCalendarProps) {
  const [month, setMonth] = useState(() => new Date())
  const { onOpen } = useTaskActions()

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 })
    const end = endOfWeek(endOfMonth(month), { weekStartsOn: 1 })
    return eachDayOfInterval({ start, end })
  }, [month])

  const tasksByDate = useMemo(() => {
    const map = new Map<string, Task[]>()
    tasks.forEach((t) => {
      const dateStr = t.dueDate || t.date
      if (!dateStr) return
      try {
        const key = format(parseISO(dateStr), 'yyyy-MM-dd')
        const existing = map.get(key) ?? []
        map.set(key, [...existing, t])
      } catch {
        // skip invalid date
      }
    })
    return map
  }, [tasks])

  const goToToday = () => setMonth(new Date())

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: C.bgPage }}>

      {/* Month navigation */}
      <div
        className="flex items-center gap-3 px-5 py-3 shrink-0"
        style={{ borderBottom: `0.5px solid ${C.border}`, backgroundColor: C.bg }}
      >
        <h2
          className="text-[15px] font-semibold flex-1"
          style={{ color: C.text, fontFamily: '"Cormorant Garamond", Garamond, serif' }}
        >
          {format(month, 'MMMM yyyy', { locale: vi })}
        </h2>

        <button
          type="button"
          onClick={goToToday}
          className="px-2.5 py-1 rounded text-[12px] cursor-pointer transition-colors duration-[120ms]"
          style={{ border: `0.5px solid ${C.border}`, color: C.muted }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = '#f5f0e8' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}
        >
          Hôm nay
        </button>

        {[
          { label: 'Prev', icon: ChevronLeft, action: () => setMonth((m) => subMonths(m, 1)) },
          { label: 'Next', icon: ChevronRight, action: () => setMonth((m) => addMonths(m, 1)) },
        ].map(({ label, icon: Icon, action }) => (
          <button
            key={label}
            type="button"
            aria-label={label}
            onClick={action}
            className="w-7 h-7 flex items-center justify-center rounded cursor-pointer transition-colors duration-[120ms]"
            style={{ color: C.muted }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = '#f5f0e8' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}
          >
            <Icon className="h-4 w-4" />
          </button>
        ))}
      </div>

      {/* Week day labels */}
      <div
        className="grid grid-cols-7 px-4 py-1.5 shrink-0"
        style={{ borderBottom: `0.5px solid ${C.border}`, backgroundColor: C.bg }}
      >
        {WEEK_DAYS.map((d) => (
          <div
            key={d}
            className="text-center text-[11px] font-medium uppercase tracking-[0.06em]"
            style={{ color: C.muted }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-7 gap-1" style={{ gridAutoRows: 'minmax(90px, auto)' }}>
          {days.map((day) => {
            const key = format(day, 'yyyy-MM-dd')
            const dayTasks = tasksByDate.get(key) ?? []
            const inMonth = isSameMonth(day, month)
            const today = isToday(day)

            return (
              <div
                key={key}
                className="rounded-lg p-1.5 flex flex-col"
                style={{
                  backgroundColor: today ? 'rgba(204,120,92,0.04)' : C.bg,
                  border: today
                    ? `1.5px solid ${C.accent}`
                    : `0.5px solid ${C.border}`,
                  opacity: inMonth ? 1 : 0.38,
                }}
              >
                {/* Date number */}
                <div className="flex items-center justify-end mb-1">
                  <span
                    className="text-[11px] font-medium w-5 h-5 flex items-center justify-center rounded-full"
                    style={{
                      backgroundColor: today ? C.accent : 'transparent',
                      color: today ? '#FFFFFF' : inMonth ? C.text : C.muted,
                    }}
                  >
                    {format(day, 'd')}
                  </span>
                </div>

                {/* Task pills */}
                <div className="flex flex-col gap-0.5">
                  {dayTasks.slice(0, 3).map((task) => {
                    const pill = priorityPillStyle(task.priority)
                    return (
                      <button
                        key={String(task.id)}
                        type="button"
                        onClick={() => onOpen(task)}
                        className="w-full text-left px-1.5 py-0.5 rounded text-[11px] truncate cursor-pointer transition-colors duration-[120ms]"
                        style={{ backgroundColor: pill.bg, color: pill.color }}
                        title={task.title}
                      >
                        {task.title}
                      </button>
                    )
                  })}
                  {dayTasks.length > 3 && (
                    <span className="text-[10px] pl-1.5" style={{ color: C.muted }}>
                      +{dayTasks.length - 3} task nữa
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
