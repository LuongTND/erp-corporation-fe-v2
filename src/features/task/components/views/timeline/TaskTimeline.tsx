import { useMemo } from 'react'
import {
  addDays,
  differenceInDays,
  endOfWeek,
  format,
  isToday,
  parseISO,
  startOfDay,
} from 'date-fns'
import type { Task } from '@/features/task/types/task.types'
import { useTaskActions } from '@/features/task/context/TaskActionsContext'

const C = {
  text: '#141413',
  muted: '#8e8b82',
  border: '#e6dfd8',
  accent: '#cc785c',
  bgHover: '#f5f0e8',
  bg: '#FFFFFF',
  bgPage: '#faf9f5',
}

const DAY_W = 34   // px per day column
const ROW_H = 38   // px per task row
const LEFT_W = 220 // px left panel

function priorityColor(priority?: string): string {
  const p = (priority ?? '').toLowerCase()
  if (p === 'urgent') return '#ef4444'
  if (p === 'high')   return '#f97316'
  if (p === 'medium') return '#f59e0b'
  return '#6366f1'
}

interface Props {
  tasks: Task[]
}

export function TaskTimeline({ tasks }: Props) {
  const { onOpen } = useTaskActions()

  const tasksWithDates = tasks.filter((t) => t.dueDate ?? t.startDate ?? t.date)

  const { rangeStart, totalDays } = useMemo(() => {
    if (tasksWithDates.length === 0) {
      const today = startOfDay(new Date())
      return { rangeStart: addDays(today, -3), totalDays: 34 }
    }
    const allMs: number[] = []
    tasksWithDates.forEach((t) => {
      if (t.startDate) allMs.push(parseISO(t.startDate).getTime())
      if (t.dueDate)   allMs.push(parseISO(t.dueDate).getTime())
      if (t.date)      allMs.push(parseISO(t.date).getTime())
    })
    const minD = startOfDay(new Date(Math.min(...allMs)))
    const maxD = startOfDay(new Date(Math.max(...allMs)))
    const rs = addDays(minD, -3)
    const re = addDays(maxD, 7)
    return { rangeStart: rs, totalDays: differenceInDays(re, rs) + 1 }
  }, [tasksWithDates])

  const today = startOfDay(new Date())
  const todayOff = differenceInDays(today, rangeStart)

  const days = useMemo(
    () => Array.from({ length: totalDays }, (_, i) => addDays(rangeStart, i)),
    [rangeStart, totalDays],
  )

  const weekHeaders = useMemo(() => {
    const headers: Array<{ label: string; span: number }> = []
    let d = rangeStart
    const rangeEnd = addDays(rangeStart, totalDays - 1)
    while (d <= rangeEnd) {
      const wEnd = endOfWeek(d, { weekStartsOn: 1 })
      const clampEnd = wEnd > rangeEnd ? rangeEnd : wEnd
      const span = differenceInDays(clampEnd, d) + 1
      headers.push({ label: format(d, "'W'w · MMM yyyy"), span })
      d = addDays(clampEnd, 1)
    }
    return headers
  }, [rangeStart, totalDays])

  if (tasksWithDates.length === 0) {
    return (
      <div className="flex items-center justify-center h-48" style={{ color: C.muted }}>
        <p className="text-[13px]">Không có task nào có ngày — thêm dueDate để hiện timeline.</p>
      </div>
    )
  }

  const gridW = totalDays * DAY_W

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: C.bgPage }}>
      <div className="overflow-auto flex-1">
        <div style={{ minWidth: LEFT_W + gridW, minHeight: '100%' }}>

          {/* ── Header ───────────────────────────────── */}
          <div
            className="flex sticky top-0 z-20"
            style={{ backgroundColor: C.bg, borderBottom: `0.5px solid ${C.border}` }}
          >
            {/* Left panel header */}
            <div
              className="shrink-0 flex items-end px-3 pb-1.5 text-[11px] font-medium"
              style={{ width: LEFT_W, color: C.muted, borderRight: `0.5px solid ${C.border}`, height: 56 }}
            >
              Task
            </div>

            {/* Date grid header */}
            <div className="relative" style={{ width: gridW, height: 56 }}>
              {/* Week row */}
              <div className="absolute top-0 left-0 right-0 h-7 flex">
                {weekHeaders.map((wh, i) => (
                  <div
                    key={i}
                    className="text-[10px] font-medium flex items-center px-1.5 shrink-0 overflow-hidden"
                    style={{
                      width: wh.span * DAY_W,
                      color: C.muted,
                      borderRight: `0.5px solid ${C.border}`,
                      backgroundColor: C.bg,
                    }}
                  >
                    {wh.label}
                  </div>
                ))}
              </div>
              {/* Day row */}
              <div className="absolute bottom-0 left-0 right-0 h-7 flex">
                {days.map((d, i) => (
                  <div
                    key={i}
                    className="text-[10px] flex items-center justify-center shrink-0 font-medium"
                    style={{
                      width: DAY_W,
                      color: isToday(d) ? C.accent : C.muted,
                      fontWeight: isToday(d) ? 700 : 400,
                      borderRight: `0.5px solid ${C.border}`,
                      backgroundColor: isToday(d) ? '#fff8f5' : 'transparent',
                    }}
                  >
                    {format(d, 'd')}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Rows ─────────────────────────────────── */}
          {tasksWithDates.map((task, rowIdx) => {
            const rawStart = task.startDate ?? task.dueDate ?? task.date!
            const rawEnd   = task.dueDate ?? task.date ?? rawStart
            const barStart = differenceInDays(startOfDay(parseISO(rawStart)), rangeStart)
            const barEnd   = differenceInDays(startOfDay(parseISO(rawEnd)),   rangeStart)
            const barSpan  = Math.max(1, barEnd - barStart + 1)
            const barColor = priorityColor(task.priority)

            return (
              <div
                key={task.id}
                className="flex"
                style={{
                  height: ROW_H,
                  borderBottom: `0.5px solid ${C.border}`,
                  backgroundColor: rowIdx % 2 === 0 ? C.bg : C.bgPage,
                }}
              >
                {/* Task name */}
                <button
                  type="button"
                  onClick={() => onOpen(task)}
                  className="shrink-0 flex items-center gap-1.5 px-3 cursor-pointer text-left transition-colors duration-[120ms] hover:bg-[#f5f0e8]"
                  style={{ width: LEFT_W, borderRight: `0.5px solid ${C.border}` }}
                >
                  {task.code && (
                    <span
                      className="text-[10px] font-medium px-1 py-0.5 rounded shrink-0"
                      style={{ backgroundColor: C.bgHover, color: C.muted }}
                    >
                      {task.code}
                    </span>
                  )}
                  <span className="text-[12px] truncate" style={{ color: C.text }}>{task.title}</span>
                </button>

                {/* Bar area */}
                <div className="relative flex-1" style={{ width: gridW }}>
                  {/* Vertical day lines */}
                  {days.map((_, i) => (
                    <div
                      key={i}
                      className="absolute top-0 bottom-0"
                      style={{
                        left: i * DAY_W,
                        width: 1,
                        backgroundColor: C.border,
                        opacity: 0.6,
                      }}
                    />
                  ))}

                  {/* Today highlight column */}
                  {todayOff >= 0 && todayOff < totalDays && (
                    <div
                      className="absolute top-0 bottom-0"
                      style={{
                        left: todayOff * DAY_W,
                        width: DAY_W,
                        backgroundColor: '#fff8f5',
                        pointerEvents: 'none',
                      }}
                    />
                  )}

                  {/* Today line */}
                  {todayOff >= 0 && todayOff < totalDays && (
                    <div
                      className="absolute top-0 bottom-0 z-10 pointer-events-none"
                      style={{
                        left: todayOff * DAY_W + DAY_W / 2,
                        width: 1.5,
                        backgroundColor: C.accent,
                        opacity: 0.5,
                      }}
                    />
                  )}

                  {/* Task bar */}
                  <button
                    type="button"
                    onClick={() => onOpen(task)}
                    title={`${task.title}\n${format(parseISO(rawStart), 'dd/MM')} → ${format(parseISO(rawEnd), 'dd/MM')}`}
                    className="absolute cursor-pointer rounded-full flex items-center px-2 overflow-hidden transition-opacity duration-[120ms] hover:opacity-100"
                    style={{
                      top: '50%',
                      transform: 'translateY(-50%)',
                      left: barStart * DAY_W + 2,
                      width: barSpan * DAY_W - 4,
                      height: 24,
                      backgroundColor: barColor,
                      opacity: 0.82,
                      minWidth: 8,
                    }}
                  >
                    <span className="text-[10px] text-white truncate font-medium select-none">
                      {task.title}
                    </span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
