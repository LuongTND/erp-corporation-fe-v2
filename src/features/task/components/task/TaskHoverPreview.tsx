import { createPortal } from 'react-dom'
import { useEffect, useRef, useState } from 'react'
import type { Task } from '../../types/task.types'

const C = {
  text: '#141413',
  muted: '#8e8b82',
  border: '#e6dfd8',
  accent: '#cc785c',
  bgHover: '#f5f0e8',
} as const

const PRIORITY_COLORS: Record<string, string> = {
  urgent: '#ef4444',
  high: '#f97316',
  medium: '#f59e0b',
  low: '#94a3b8',
}

interface PreviewState {
  task: Task
  x: number
  y: number
}

interface Props {
  tasks: Task[]
}

export function TaskHoverPreview({ tasks }: Props) {
  const [preview, setPreview] = useState<PreviewState | null>(null)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const taskMap = useRef(new Map<string, Task>())

  // Keep task map in sync
  useEffect(() => {
    taskMap.current = new Map(tasks.map((t) => [String(t.id), t]))
  }, [tasks])

  useEffect(() => {
    const show = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('[data-task-id]') as HTMLElement | null
      if (!target) return
      const id = target.dataset.taskId
      if (!id) return
      const task = taskMap.current.get(id)
      if (!task) return

      if (hideTimer.current) {
        clearTimeout(hideTimer.current)
        hideTimer.current = null
      }

      const rect = target.getBoundingClientRect()
      setPreview({
        task,
        x: rect.left + window.scrollX,
        y: rect.bottom + window.scrollY + 6,
      })
    }

    const hide = (e: MouseEvent) => {
      const related = e.relatedTarget as HTMLElement | null
      if (related?.closest('[data-hover-preview]') || related?.closest('[data-task-id]')) return
      hideTimer.current = setTimeout(() => setPreview(null), 150)
    }

    document.addEventListener('mouseover', show)
    document.addEventListener('mouseout', hide)
    return () => {
      document.removeEventListener('mouseover', show)
      document.removeEventListener('mouseout', hide)
    }
  }, [])

  if (!preview) return null

  const { task, x, y } = preview
  const priorityColor = PRIORITY_COLORS[task.priority?.toLowerCase() ?? ''] ?? C.muted

  return createPortal(
    <div
      data-hover-preview
      onMouseEnter={() => hideTimer.current && (clearTimeout(hideTimer.current), (hideTimer.current = null))}
      onMouseLeave={() => { hideTimer.current = setTimeout(() => setPreview(null), 150) }}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        zIndex: 9999,
        width: 280,
        backgroundColor: '#FFFFFF',
        border: `0.5px solid ${C.border}`,
        borderRadius: 10,
        boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
        padding: '10px 12px',
        pointerEvents: 'auto',
      }}
    >
      {/* Header */}
      <div className="flex items-start gap-2 mb-2">
        <span
          className="w-2 h-2 rounded-full shrink-0 mt-1.5"
          style={{ backgroundColor: priorityColor }}
        />
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold leading-tight" style={{ color: C.text }}>
            {task.title}
          </p>
          {task.code && (
            <span className="text-[11px]" style={{ color: C.muted }}>{task.code}</span>
          )}
        </div>
      </div>

      {/* Meta row */}
      <div className="flex items-center gap-3 flex-wrap">
        {task.status && (
          <span
            className="text-[11px] px-1.5 py-0.5 rounded"
            style={{ backgroundColor: C.bgHover, color: C.muted }}
          >
            {task.status}
          </span>
        )}
        {task.priority && (
          <span className="text-[11px] font-medium" style={{ color: priorityColor }}>
            {task.priority}
          </span>
        )}
        {task.dueDate && (
          <span className="text-[11px]" style={{ color: C.muted }}>
            Hạn: {new Date(task.dueDate).toLocaleDateString('vi-VN')}
          </span>
        )}
      </div>

      {/* Description snippet */}
      {task.description && (
        <p
          className="text-[12px] mt-2 leading-relaxed line-clamp-3"
          style={{ color: C.muted }}
        >
          {task.description.replace(/<[^>]+>/g, '').slice(0, 120)}
          {task.description.length > 120 ? '…' : ''}
        </p>
      )}
    </div>,
    document.body,
  )
}
