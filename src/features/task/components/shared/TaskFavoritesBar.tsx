import { Clock, Star } from 'lucide-react'
import type { Task } from '@/features/task/types/task.types'

const C = {
  text: '#141413',
  muted: '#8e8b82',
  border: '#e6dfd8',
  accent: '#cc785c',
  bgHover: '#f5f0e8',
} as const

interface Props {
  tasks: Task[]
  favorites: string[]
  recents: string[]
  onTaskClick: (task: Task) => void
}

function TaskChip({ task, icon, onTaskClick }: { task: Task; icon: React.ReactNode; onTaskClick: (t: Task) => void }) {
  return (
    <button
      type="button"
      onClick={() => onTaskClick(task)}
      className="inline-flex items-center gap-1.5 h-6 px-2 rounded-full text-[11px] shrink-0 cursor-pointer transition-colors duration-[120ms] max-w-[140px]"
      style={{ border: `0.5px solid ${C.border}`, color: C.muted, backgroundColor: 'transparent' }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = C.bgHover }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}
      title={task.title}
    >
      {icon}
      <span className="truncate">{task.code ?? task.title}</span>
    </button>
  )
}

export function TaskFavoritesBar({ tasks, favorites, recents, onTaskClick }: Props) {
  const taskMap = new Map(tasks.map((t) => [String(t.id), t]))

  const favoriteTasks = favorites
    .map((id) => taskMap.get(id))
    .filter(Boolean) as Task[]

  const recentTasks = recents
    .map((id) => taskMap.get(id))
    .filter((t): t is Task => !!t && !favorites.includes(String(t.id)))

  if (favoriteTasks.length === 0 && recentTasks.length === 0) return null

  return (
    <div
      className="flex items-center gap-2 px-5 py-1.5 overflow-x-auto shrink-0"
      style={{
        backgroundColor: '#faf9f5',
        borderBottom: `0.5px solid ${C.border}`,
        minHeight: 36,
      }}
    >
      {favoriteTasks.length > 0 && (
        <>
          <span className="text-[10px] font-medium uppercase tracking-[0.06em] shrink-0" style={{ color: C.muted }}>
            Yêu thích
          </span>
          {favoriteTasks.map((task) => (
            <TaskChip
              key={String(task.id)}
              task={task}
              icon={<Star className="h-2.5 w-2.5 shrink-0" style={{ color: C.accent }} />}
              onTaskClick={onTaskClick}
            />
          ))}
        </>
      )}

      {favoriteTasks.length > 0 && recentTasks.length > 0 && (
        <div className="h-4 w-px shrink-0" style={{ backgroundColor: C.border }} />
      )}

      {recentTasks.length > 0 && (
        <>
          <span className="text-[10px] font-medium uppercase tracking-[0.06em] shrink-0" style={{ color: C.muted }}>
            Gần đây
          </span>
          {recentTasks.slice(0, 5).map((task) => (
            <TaskChip
              key={String(task.id)}
              task={task}
              icon={<Clock className="h-2.5 w-2.5 shrink-0" style={{ color: C.muted }} />}
              onTaskClick={onTaskClick}
            />
          ))}
        </>
      )}
    </div>
  )
}
