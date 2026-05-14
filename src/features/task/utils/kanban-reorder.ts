import type { Id, Task } from '../types/task.types'
import { applyStatusForColumn } from './task-status'

export function moveTaskToColumnAtIndex(
  tasks: Task[],
  activeId: Id,
  columnId: Id,
  index: number,
): Task[] {
  const activeIndex = tasks.findIndex((t) => t.id === activeId)
  if (activeIndex === -1) return tasks

  const activeTask = tasks[activeIndex]
  const nextTasks = tasks.filter((task) => task.id !== activeId)

  const columnIndices: number[] = []
  for (let i = 0; i < nextTasks.length; i += 1) {
    if (nextTasks[i].columnId === columnId) {
      columnIndices.push(i)
    }
  }

  let insertIndex = nextTasks.length
  if (columnIndices.length > 0) {
    if (index <= 0) {
      insertIndex = columnIndices[0]
    } else if (index >= columnIndices.length) {
      insertIndex = columnIndices[columnIndices.length - 1] + 1
    } else {
      insertIndex = columnIndices[index]
    }
  }

  const baseTask =
    activeTask.columnId === columnId ? activeTask : { ...activeTask, columnId }
  const updatedTask = applyStatusForColumn(baseTask, columnId)

  return [...nextTasks.slice(0, insertIndex), updatedTask, ...nextTasks.slice(insertIndex)]
}
