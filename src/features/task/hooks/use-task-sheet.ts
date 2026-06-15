import { useState, useEffect, useRef, useCallback } from 'react'
import type { Task, Column, UpdateTaskRequest, TaskItemDto } from '../types/task.types'

interface UseTaskSheetProps {
  isOpen: boolean
  task?: Task | null
  columns?: Column[]
  onTaskUpdate?: (taskId: string, updateData: UpdateTaskRequest) => Promise<TaskItemDto>
  onClose: () => void
}

export function useTaskSheet({ isOpen, task, columns, onTaskUpdate, onClose }: UseTaskSheetProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('')
  const [priority, setPriority] = useState('')
  const [assignee, setAssignee] = useState<string>('')
  const [tag, setTag] = useState('')
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined)
  const [createdAt, setCreatedAt] = useState<Date>(new Date())

  const [isUpdating, setIsUpdating] = useState(false)

  const initialValuesRef = useRef({
    title: '',
    description: '',
    status: '',
    priority: '',
    assignee: '',
    tag: '',
    startDate: undefined as Date | undefined,
    dueDate: undefined as Date | undefined,
  })

  useEffect(() => {
    if (!isOpen) return

    if (task) {
      const newValues = {
        title: task.title,
        description: task.description || '',
        status: task.columnId != null ? String(task.columnId) : '',
        priority: task.priorityId || task.priority || '',
        assignee: task.assignee || '',
        tag: task.tag || '',
        startDate: task.startDate ? new Date(task.startDate) : undefined,
        dueDate: (task.dueDate ?? task.date) ? new Date((task.dueDate ?? task.date)!) : undefined,
      }

      initialValuesRef.current = newValues

      setTitle(newValues.title)
      setDescription(newValues.description)
      setStatus(newValues.status)
      setPriority(newValues.priority)
      setAssignee(newValues.assignee)
      setTag(newValues.tag)
      setStartDate(newValues.startDate)
      setDueDate(newValues.dueDate)

      const parsedDate = task.date ? new Date(task.date) : new Date()
      setCreatedAt(Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate)
    } else {
      const defaultStatus = columns?.[0]?.id != null ? String(columns[0].id) : ''
      initialValuesRef.current = {
        title: '',
        description: '',
        status: defaultStatus,
        priority: '',
        assignee: '',
        tag: '',
        startDate: undefined,
        dueDate: undefined,
      }

      setTitle('')
      setDescription('')
      setStatus(defaultStatus)
      setPriority('')
      setAssignee('')
      setTag('')
      setStartDate(undefined)
      setDueDate(undefined)
      setCreatedAt(new Date())
    }
  }, [isOpen, task, columns])

  const buildUpdateData = useCallback((): UpdateTaskRequest => {
    const updateData: UpdateTaskRequest = {}
    if (title !== initialValuesRef.current.title) updateData.title = title
    if (description !== initialValuesRef.current.description) updateData.description = description
    if (status !== initialValuesRef.current.status) updateData.statusId = status
    if (priority !== initialValuesRef.current.priority) updateData.priorityId = priority || undefined
    if (startDate !== initialValuesRef.current.startDate)
      updateData.startDate = startDate?.toISOString()
    if (dueDate !== initialValuesRef.current.dueDate) updateData.dueDate = dueDate?.toISOString()
    return updateData
  }, [title, description, status, priority, startDate, dueDate])

  const hasPendingChanges = useCallback(() => {
    return (
      title !== initialValuesRef.current.title ||
      description !== initialValuesRef.current.description ||
      status !== initialValuesRef.current.status ||
      priority !== initialValuesRef.current.priority ||
      startDate !== initialValuesRef.current.startDate ||
      dueDate !== initialValuesRef.current.dueDate
    )
  }, [title, description, status, priority, startDate, dueDate])

  const handleSheetClose = async () => {
    if (isUpdating) return

    if (hasPendingChanges() && task && onTaskUpdate) {
      try {
        setIsUpdating(true)
        const updateData = buildUpdateData()
        if (Object.keys(updateData).length > 0) {
          await onTaskUpdate(String(task.id), updateData)
        }

        initialValuesRef.current = {
          ...initialValuesRef.current,
          title,
          description,
          status,
          priority,
          startDate,
          dueDate,
        }
      } catch (error) {
        console.error('Close save error:', error)
      } finally {
        setIsUpdating(false)
      }
    }
    onClose()
  }

  return {
    formState: {
      title,
      description,
      status,
      priority,
      assignee,
      tag,
      startDate,
      dueDate,
      createdAt,
      isUpdating,
    },
    setters: {
      setTitle,
      setDescription,
      setStatus,
      setPriority,
      setAssignee,
      setTag,
      setStartDate,
      setDueDate,
    },
    handleSheetClose,
  }
}
