import { ChevronRight } from 'lucide-react'
import type { Task } from '../../types/task.types'

interface Props {
  task: Task
  onNavigate?: (taskId: string) => void
}

const C = {
  muted: '#8e8b82',
  accent: '#cc785c',
  bgHover: '#f5f0e8',
} as const

export function TaskBreadcrumb({ task, onNavigate }: Props) {
  if (!task.parentId) return null

  return (
    <div className="flex items-center gap-1 mb-2 flex-wrap">
      {/* Root label */}
      <span className="text-[11px]" style={{ color: C.muted }}>Tasks</span>

      <ChevronRight className="h-3 w-3 shrink-0" style={{ color: C.muted }} />

      {/* Parent task */}
      {task.parentId && (
        <>
          <button
            type="button"
            onClick={() => onNavigate?.(task.parentId!)}
            className="text-[11px] rounded px-1 py-0.5 cursor-pointer transition-colors duration-[120ms] max-w-[120px] truncate"
            style={{ color: C.accent }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = C.bgHover }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}
            title={task.parentTitle}
          >
            {task.parentCode ?? task.parentTitle ?? task.parentId}
          </button>
          <ChevronRight className="h-3 w-3 shrink-0" style={{ color: C.muted }} />
        </>
      )}

      {/* Current task */}
      <span
        className="text-[11px] font-medium max-w-[120px] truncate"
        style={{ color: C.muted }}
        title={task.title}
      >
        {task.code ?? task.title}
      </span>
    </div>
  )
}
