import { createContext, useContext, type ReactNode } from 'react'
import type { Task } from '../types/task.types'

interface TaskActionsContextValue {
  onOpen: (task: Task) => void
  onDuplicate: (task: Task) => void
  onArchive: (taskId: string) => void
}

const TaskActionsContext = createContext<TaskActionsContextValue | null>(null)

export function TaskActionsProvider({
  children,
  onOpen,
  onDuplicate,
  onArchive,
}: TaskActionsContextValue & { children: ReactNode }) {
  return (
    <TaskActionsContext.Provider value={{ onOpen, onDuplicate, onArchive }}>
      {children}
    </TaskActionsContext.Provider>
  )
}

export function useTaskActions() {
  const ctx = useContext(TaskActionsContext)
  if (!ctx) throw new Error('useTaskActions must be within TaskActionsProvider')
  return ctx
}
