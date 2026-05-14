import type { Id, Task } from '../types/task.types'

const COLUMN_STATUS_MAP: Record<string, Task['status']> = {
  'col-todo': 'todo',
  'col-inprogress': 'in-progress',
  'col-review': 'in-review',
  'col-done': 'done',
}

const NUMBER_STATUS_MAP: Record<number, Task['status']> = {
  1: 'todo',
  2: 'in-progress',
  3: 'in-review',
  4: 'done',
}

export const getStatusForColumn = (columnId: Id) => {
  if (typeof columnId === 'string' && COLUMN_STATUS_MAP[columnId]) {
    return COLUMN_STATUS_MAP[columnId]
  }
  if (typeof columnId === 'number') {
    return NUMBER_STATUS_MAP[columnId]
  }
  return undefined
}

export const applyStatusForColumn = (task: Task, columnId: Id): Task => {
  const derivedStatus = getStatusForColumn(columnId)
  if (!derivedStatus || task.status === derivedStatus) return task
  return { ...task, status: derivedStatus }
}

export const syncTaskStatus = (tasks: Task[]) =>
  tasks.map((task) => applyStatusForColumn(task, task.columnId))
