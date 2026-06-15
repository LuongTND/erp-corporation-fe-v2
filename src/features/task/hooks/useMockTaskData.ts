import { useEffect, useState } from 'react'
import {
  taskItemService,
  taskPriorityService,
  taskStatusService,
} from '@/features/task/mocks/task.mock'
import type { TaskPriorityDto } from '@/features/task/types/priority.types'
import type { Column, Task, TaskItemDto, TaskStatusDto } from '@/features/task/types/task.types'

type TaskMeta = {
  columns: Column[]
  priorities: TaskPriorityDto[]
  statuses: TaskStatusDto[]
}

let cachedTaskMeta: TaskMeta | null = null
let taskMetaPromise: Promise<TaskMeta> | null = null

export function mapTaskItemToTask(taskItem: TaskItemDto): Task {
  const relationTask = taskItem as TaskItemDto & {
    parentCode?: string
    parentId?: string
    parentTitle?: string
  }

  return {
    id: taskItem.id,
    columnId: taskItem.statusId,
    title: taskItem.title,
    description: taskItem.description,
    parentId: relationTask.parentId,
    parentTitle: relationTask.parentTitle,
    parentCode: relationTask.parentCode,
    code: taskItem.code,
    status: taskItem.statusName as Task['status'],
    priorityId: taskItem.priorityId,
    priority: taskItem.priorityName as Task['priority'],
    assignee: taskItem.creatorName || 'Unassigned',
    date: taskItem.dueDate,
    dueDate: taskItem.dueDate,
    startDate: taskItem.startDate,
    estimatedHours: taskItem.estimatedHours,
  }
}

function mapTaskStatusToColumn(status: TaskStatusDto): Column {
  return {
    id: status.id,
    title: status.name,
    color: status.color,
  }
}

async function loadTaskMeta(): Promise<TaskMeta> {
  if (cachedTaskMeta) return cachedTaskMeta
  if (taskMetaPromise) return taskMetaPromise

  taskMetaPromise = Promise.all([
    taskStatusService.getAllForDropdown(),
    taskPriorityService.getAllForDropdown(),
  ]).then(([statuses, priorities]) => {
    const nextMeta = {
      statuses,
      priorities,
      columns: statuses.map(mapTaskStatusToColumn),
    }
    cachedTaskMeta = nextMeta
    taskMetaPromise = null
    return nextMeta
  }).catch((error) => {
    taskMetaPromise = null
    throw error
  })

  return taskMetaPromise
}

export function setMockTaskMeta(partialMeta: Partial<TaskMeta>) {
  if (!cachedTaskMeta) return
  cachedTaskMeta = {
    ...cachedTaskMeta,
    ...partialMeta,
  }
}

export function useMockTaskMeta() {
  const [meta, setMeta] = useState<TaskMeta | null>(cachedTaskMeta)
  const [isLoading, setIsLoading] = useState(!cachedTaskMeta)

  useEffect(() => {
    let isMounted = true

    const loadMeta = async () => {
      try {
        const nextMeta = await loadTaskMeta()
        if (!isMounted) return
        setMeta(nextMeta)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    void loadMeta()

    return () => {
      isMounted = false
    }
  }, [])

  return {
    columns: meta?.columns ?? [],
    isLoading,
    priorities: meta?.priorities ?? [],
    statuses: meta?.statuses ?? [],
  }
}

export function useMockTaskWorkspaceData() {
  const [columns, setColumns] = useState<Column[]>(cachedTaskMeta?.columns ?? [])
  const [tasks, setTasks] = useState<Task[]>([])
  const [statuses, setStatuses] = useState<TaskStatusDto[]>(cachedTaskMeta?.statuses ?? [])
  const [priorities, setPriorities] = useState<TaskPriorityDto[]>(cachedTaskMeta?.priorities ?? [])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const loadData = async () => {
      try {
        setIsLoading(true)
        const [meta, taskResponse] = await Promise.all([
          loadTaskMeta(),
          taskItemService.getAll(),
        ])

        if (!isMounted) return

        setStatuses(meta.statuses)
        setPriorities(meta.priorities)
        setColumns(meta.columns)
        setTasks(taskResponse.items.map(mapTaskItemToTask))
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    void loadData()

    return () => {
      isMounted = false
    }
  }, [])

  return {
    columns,
    isLoading,
    priorities,
    setColumns,
    setTasks,
    statuses,
    tasks,
  }
}

export function useMockTaskDetail(taskId?: string) {
  const [task, setTask] = useState<TaskItemDto | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let isMounted = true

    if (!taskId) {
      setTask(null)
      setNotFound(true)
      setIsLoading(false)
      return () => {
        isMounted = false
      }
    }

    const loadTask = async () => {
      try {
        setIsLoading(true)
        setNotFound(false)
        const nextTask = await taskItemService.getById(taskId)
        if (!isMounted) return
        setTask(nextTask ?? null)
        setNotFound(!nextTask)
      } catch {
        if (!isMounted) return
        setTask(null)
        setNotFound(true)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    void loadTask()

    return () => {
      isMounted = false
    }
  }, [taskId])

  return {
    isLoading,
    notFound,
    task,
  }
}

export function useMockTaskPriorities() {
  const { isLoading, priorities } = useMockTaskMeta()

  return {
    isLoading,
    priorities,
  }
}
