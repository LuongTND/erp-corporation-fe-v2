import { useEffect, useRef, useState } from 'react'
import type React from 'react'
import { toast } from 'sonner'
import {
  type DragEndEvent,
  type DragMoveEvent,
  type DragOverEvent,
  type DragStartEvent,
  PointerSensor,
  type UniqueIdentifier,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import type { Task, Id } from '../types/task.types'
import { moveTaskToColumnAtIndex } from '../utils/kanban-reorder'
import { taskItemService } from '../mocks/task.mock'

export type DropHint =
  | null
  | {
      columnId: Id
      index: number
      overTaskId?: Id
    }

export type ColumnPositionSnapshot = {
  containerTop: number
  containerBottom: number
  containerLeft: number
  containerRight: number
  items: Array<{ id: Id; top: number; bottom: number }>
}

const getClientPoint = (event: Event | null) => {
  if (!event) return null
  const touchEvent = event as TouchEvent
  if (touchEvent.touches && touchEvent.touches.length > 0) {
    return { x: touchEvent.touches[0].clientX, y: touchEvent.touches[0].clientY }
  }
  if (touchEvent.changedTouches && touchEvent.changedTouches.length > 0) {
    return { x: touchEvent.changedTouches[0].clientX, y: touchEvent.changedTouches[0].clientY }
  }
  const mouseEvent = event as MouseEvent
  if (typeof mouseEvent.clientX === 'number' && typeof mouseEvent.clientY === 'number') {
    return { x: mouseEvent.clientX, y: mouseEvent.clientY }
  }
  return null
}

interface UseKanbanDndArgs {
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
  tasksByColumn: Map<Id, Task[]>
  columnPositionsByIdRef: React.MutableRefObject<Map<Id, ColumnPositionSnapshot>>
}

const toId = (id: UniqueIdentifier): Id => id

const areDropHintsEqual = (a: DropHint, b: DropHint) => {
  if (a === b) return true
  if (!a || !b) return false
  return a.columnId === b.columnId && a.index === b.index && a.overTaskId === b.overTaskId
}

export function useKanbanDnd({ setTasks, tasksByColumn, columnPositionsByIdRef }: UseKanbanDndArgs) {
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [activeId, setActiveId] = useState<Id | null>(null)
  const [dropHint, setDropHint] = useState<DropHint>(null)
  const [isDragging, setIsDragging] = useState(false)

  const rafRef = useRef<number | null>(null)
  const pendingDropHintRef = useRef<DropHint>(null)
  const dropHintRef = useRef<DropHint>(null)

  const activeColumnIdRef = useRef<Id | null>(null)
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null)
  const pointerOffsetYRef = useRef<number>(0)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  )

  const scheduleDropHint = (nextHint: DropHint) => {
    if (areDropHintsEqual(dropHintRef.current, nextHint)) return
    if (areDropHintsEqual(pendingDropHintRef.current, nextHint)) return
    pendingDropHintRef.current = nextHint
    if (rafRef.current != null) return
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null
      const pending = pendingDropHintRef.current
      pendingDropHintRef.current = null
      if (!areDropHintsEqual(dropHintRef.current, pending)) {
        dropHintRef.current = pending
        setDropHint(pending)
      }
    })
  }

  const clearDropHint = () => {
    dropHintRef.current = null
    pendingDropHintRef.current = null
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    setDropHint(null)
  }

  function onDragStart(event: DragStartEvent) {
    setActiveId(toId(event.active.id))
    setIsDragging(true)

    if (event.active.data.current?.type === 'Task') {
      const task = event.active.data.current.task as Task
      setActiveTask(task)
      activeColumnIdRef.current = task.columnId
    }

    const p = getClientPoint(event.activatorEvent)
    pointerStartRef.current = p

    const initialRect = event.active.rect.current.initial
    if (p && initialRect) {
      pointerOffsetYRef.current = p.y - initialRect.top
    } else {
      pointerOffsetYRef.current = (initialRect?.height ?? 0) / 2
    }
  }

  const getPointerY = (event: DragOverEvent | DragMoveEvent) => {
    const translated = event.active.rect.current.translated
    const initial = event.active.rect.current.initial
    const rect = translated ?? initial
    if (!rect) return null
    return rect.top + pointerOffsetYRef.current
  }

  const getPointerX = (event: DragOverEvent | DragMoveEvent) => {
    if (pointerStartRef.current) {
      return pointerStartRef.current.x + event.delta.x
    }
    const translated = event.active.rect.current.translated
    const initial = event.active.rect.current.initial
    const rect = translated ?? initial
    if (!rect) return null
    return rect.left + rect.width / 2
  }

  const getIndexFromRelativeY = (
    items: ColumnPositionSnapshot['items'],
    relativeY: number,
    fallbackLength: number,
  ) => {
    if (items.length === 0) return 0
    if (!Number.isFinite(relativeY)) {
      return fallbackLength === 0 ? 0 : relativeY <= 0 ? 0 : fallbackLength
    }
    for (let i = 0; i < items.length; i += 1) {
      const item = items[i]
      if (relativeY < item.top) return i
      if (relativeY >= item.top && relativeY <= item.bottom) {
        const midpoint = (item.top + item.bottom) / 2
        return relativeY < midpoint ? i : i + 1
      }
    }
    return items.length
  }

  const getColumnIdFromPointer = (pointerX: number | null, pointerY: number | null) => {
    if (pointerX == null || pointerY == null) return null
    for (const [columnId, snapshot] of columnPositionsByIdRef.current) {
      if (
        pointerX >= snapshot.containerLeft &&
        pointerX <= snapshot.containerRight &&
        pointerY >= snapshot.containerTop &&
        pointerY <= snapshot.containerBottom
      ) {
        return columnId
      }
    }
    return null
  }

  const getEffectiveItems = (columnId: Id, items: ColumnPositionSnapshot['items']) => {
    if (!activeId) return items
    if (activeColumnIdRef.current !== columnId) return items
    return items.filter((item) => item.id !== activeId)
  }

  const getEffectiveFallbackLength = (columnId: Id, length: number) => {
    if (!activeId) return length
    if (activeColumnIdRef.current !== columnId) return length
    return Math.max(0, length - 1)
  }

  const updateDropHintForEvent = (event: DragOverEvent | DragMoveEvent) => {
    const pointerY = getPointerY(event)
    const pointerX = getPointerX(event)

    if (!event.over) {
      const fallbackColumnId = getColumnIdFromPointer(pointerX, pointerY)
      if (!fallbackColumnId || pointerY == null) {
        scheduleDropHint(null)
        return
      }
      const snapshot = columnPositionsByIdRef.current.get(fallbackColumnId)
      if (!snapshot) {
        scheduleDropHint(null)
        return
      }
      const items = snapshot.items ?? []
      const effectiveItems = getEffectiveItems(fallbackColumnId, items)
      const relativeY = pointerY - snapshot.containerTop
      const fallbackLengthRaw = tasksByColumn.get(fallbackColumnId)?.length ?? items.length
      const fallbackLength = getEffectiveFallbackLength(fallbackColumnId, fallbackLengthRaw)
      const index = getIndexFromRelativeY(effectiveItems, relativeY, fallbackLength)
      scheduleDropHint({ columnId: fallbackColumnId, index })
      return
    }

    const overType = event.over.data.current?.type

    if (overType === 'Task') {
      const overTask = event.over.data.current?.task as Task | undefined
      const columnId = (overTask?.columnId ?? toId(event.over.id)) as Id
      const snapshot = columnPositionsByIdRef.current.get(columnId)
      const items = snapshot?.items ?? []
      const effectiveItems = getEffectiveItems(columnId, items)
      const overId = toId(event.over.id)
      if (overId === activeId) return
      const overIndex = effectiveItems.findIndex((it) => it.id === overId)
      if (overIndex === -1) {
        scheduleDropHint(null)
        return
      }
      const overRect = event.over.rect
      const mid = overRect.top + overRect.height / 2
      const isBelow = pointerY != null ? pointerY > mid : false
      const index = overIndex + (isBelow ? 1 : 0)
      scheduleDropHint({ columnId, index, overTaskId: overId })
      return
    }

    if (overType === 'Column') {
      const columnId = toId(event.over.id)
      const snapshot = columnPositionsByIdRef.current.get(columnId)
      const items = snapshot?.items ?? []
      const effectiveItems = getEffectiveItems(columnId, items)
      const overRect = event.over.rect
      const containerTop = snapshot?.containerTop ?? overRect.top
      const fallbackPointerY = overRect.top + overRect.height / 2
      const py = pointerY ?? fallbackPointerY
      const relativeY = py - containerTop
      const fallbackLengthRaw = tasksByColumn.get(columnId)?.length ?? items.length
      const fallbackLength = getEffectiveFallbackLength(columnId, fallbackLengthRaw)
      const index = getIndexFromRelativeY(effectiveItems, relativeY, fallbackLength)
      scheduleDropHint({ columnId, index })
      return
    }

    scheduleDropHint(null)
  }

  function onDragOver(event: DragOverEvent) {
    updateDropHintForEvent(event)
  }

  function onDragMove(event: DragMoveEvent) {
    updateDropHintForEvent(event)
  }

  async function onDragEnd(event: DragEndEvent) {
    const latestDropHint = pendingDropHintRef.current ?? dropHintRef.current
    if (!activeId || (!event.over && !latestDropHint)) {
      setActiveTask(null)
      setActiveId(null)
      setIsDragging(false)
      activeColumnIdRef.current = null
      pointerStartRef.current = null
      pointerOffsetYRef.current = 0
      clearDropHint()
      return
    }

    if (!latestDropHint) {
      setActiveTask(null)
      setActiveId(null)
      setIsDragging(false)
      activeColumnIdRef.current = null
      pointerOffsetYRef.current = 0
      clearDropHint()
      return
    }

    setTasks((prev) =>
      moveTaskToColumnAtIndex(prev, activeId, latestDropHint.columnId, latestDropHint.index),
    )

    if (activeColumnIdRef.current !== latestDropHint.columnId) {
      try {
        await taskItemService.updateStatus(String(activeId), {
          statusId: String(latestDropHint.columnId),
        })
        toast.success('Cập nhật trạng thái công việc thành công')
      } catch (error) {
        console.error('Lỗi khi cập nhật trạng thái task:', error)
        toast.error('Không thể cập nhật trạng thái công việc')
        setTasks((prev) =>
          moveTaskToColumnAtIndex(prev, activeId, activeColumnIdRef.current!, 0),
        )
      }
    }

    setActiveTask(null)
    setActiveId(null)
    setIsDragging(false)
    activeColumnIdRef.current = null
    pointerStartRef.current = null
    pointerOffsetYRef.current = 0
    clearDropHint()
  }

  function onDragCancel() {
    setActiveTask(null)
    setActiveId(null)
    setIsDragging(false)
    activeColumnIdRef.current = null
    pointerStartRef.current = null
    pointerOffsetYRef.current = 0
    clearDropHint()
  }

  useEffect(() => {
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return {
    sensors,
    activeTask,
    activeId,
    dropHint,
    isDragging,
    onDragStart,
    onDragOver,
    onDragMove,
    onDragEnd,
    onDragCancel,
  }
}
