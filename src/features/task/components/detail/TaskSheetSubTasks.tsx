import { useState, useEffect, useRef } from 'react'
import { Plus, X, Check } from 'lucide-react'

const C = {
  text: '#141413',
  muted: '#8e8b82',
  border: '#e6dfd8',
  accent: '#cc785c',
  bgHover: '#f5f0e8',
} as const

interface SubTask {
  id: string
  title: string
  done: boolean
}

interface TaskSheetSubTasksProps {
  taskId?: string
}

export function TaskSheetSubTasks({ taskId }: TaskSheetSubTasksProps) {
  const [subtasks, setSubtasks] = useState<SubTask[]>([])
  const [newTitle, setNewTitle] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setSubtasks([])
    setNewTitle('')
    setIsAdding(false)
  }, [taskId])

  useEffect(() => {
    if (isAdding) inputRef.current?.focus()
  }, [isAdding])

  const commitNew = () => {
    const title = newTitle.trim()
    if (title) {
      setSubtasks((prev) => [
        ...prev,
        { id: `st-${Date.now()}`, title, done: false },
      ])
    }
    setNewTitle('')
    if (!title) setIsAdding(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      commitNew()
    }
    if (e.key === 'Escape') {
      setNewTitle('')
      setIsAdding(false)
    }
  }

  const toggleDone = (id: string) =>
    setSubtasks((prev) =>
      prev.map((s) => (s.id === id ? { ...s, done: !s.done } : s)),
    )

  const remove = (id: string) =>
    setSubtasks((prev) => prev.filter((s) => s.id !== id))

  const doneCount = subtasks.filter((s) => s.done).length
  const progress = subtasks.length > 0 ? Math.round((doneCount / subtasks.length) * 100) : 0

  return (
    <div className="flex flex-col gap-2">
      {/* Header */}
      <div className="flex items-center gap-2">
        <p
          className="text-[11px] font-medium uppercase tracking-[0.06em]"
          style={{ color: C.muted }}
        >
          Task con
        </p>
        {subtasks.length > 0 && (
          <span className="text-[11px]" style={{ color: C.muted }}>
            {doneCount}/{subtasks.length}
          </span>
        )}
      </div>

      {/* Progress bar */}
      {subtasks.length > 0 && (
        <div
          className="h-1 rounded-full overflow-hidden"
          style={{ backgroundColor: C.border }}
        >
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${progress}%`,
              backgroundColor: progress === 100 ? '#22c55e' : C.accent,
            }}
          />
        </div>
      )}

      {/* Sub-task list */}
      <div className="flex flex-col gap-0.5">
        {subtasks.map((st) => (
          <SubTaskRow key={st.id} subtask={st} onToggle={toggleDone} onRemove={remove} />
        ))}
      </div>

      {/* Add row */}
      {isAdding ? (
        <div className="flex items-center gap-2 px-1 py-0.5 rounded">
          <div
            className="w-4 h-4 rounded border shrink-0"
            style={{ borderColor: C.border }}
          />
          <input
            ref={inputRef}
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={commitNew}
            placeholder="Tên sub-task…"
            className="flex-1 bg-transparent border-none outline-none text-[13px]"
            style={{ color: C.text }}
          />
        </div>
      ) : (
        <button
          type="button"
          className="flex items-center gap-1.5 px-1 py-0.5 text-[12px] cursor-pointer transition-colors duration-[120ms] rounded w-fit"
          style={{ color: C.muted }}
          onClick={() => setIsAdding(true)}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = C.text
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = C.muted
          }}
        >
          <Plus className="h-3 w-3" />
          Thêm sub-task
        </button>
      )}
    </div>
  )
}

function SubTaskRow({
  subtask,
  onToggle,
  onRemove,
}: {
  subtask: SubTask
  onToggle: (id: string) => void
  onRemove: (id: string) => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="flex items-center gap-2 px-1 py-0.5 rounded transition-colors duration-[120ms]"
      style={{ backgroundColor: hovered ? C.bgHover : 'transparent' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        type="button"
        onClick={() => onToggle(subtask.id)}
        className="flex items-center justify-center w-4 h-4 rounded border shrink-0 transition-colors duration-[120ms] cursor-pointer"
        style={{
          borderColor: subtask.done ? C.accent : C.border,
          backgroundColor: subtask.done ? C.accent : 'transparent',
        }}
      >
        {subtask.done && <Check className="h-2.5 w-2.5 text-white" />}
      </button>

      <span
        className="flex-1 text-[13px] leading-snug"
        style={{
          color: subtask.done ? C.muted : C.text,
          textDecoration: subtask.done ? 'line-through' : 'none',
        }}
      >
        {subtask.title}
      </span>

      {hovered && (
        <button
          type="button"
          onClick={() => onRemove(subtask.id)}
          className="cursor-pointer rounded p-0.5 transition-colors duration-[120ms]"
          style={{ color: C.muted }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = C.border
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  )
}
