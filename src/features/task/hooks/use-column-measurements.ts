import { useCallback, useEffect, useLayoutEffect, useRef } from 'react'
import type { ColumnPositionSnapshot } from './use-kanban-dnd'
import type { Id, Task } from '../types/task.types'

interface UseColumnMeasurementsArgs {
  columnId: Id
  tasks: Task[]
  onPositionsChange?: (columnId: Id, snapshot: ColumnPositionSnapshot) => void
  isDragging?: boolean
  shouldMeasure: boolean
}

export function useColumnMeasurements({
  columnId,
  tasks,
  onPositionsChange,
  isDragging,
  shouldMeasure,
}: UseColumnMeasurementsArgs) {
  const listRef = useRef<HTMLDivElement | null>(null)
  const positionMapRef = useRef<Map<Id, { top: number; bottom: number }>>(new Map())

  const measurePositions = useCallback(() => {
    const container = listRef.current
    if (!container) return

    const containerRect = container.getBoundingClientRect()
    const computedStyle = window.getComputedStyle(container)
    const paddingTop = Number.parseFloat(computedStyle.paddingTop || '0') || 0
    const paddingLeft = Number.parseFloat(computedStyle.paddingLeft || '0') || 0
    const paddingRight = Number.parseFloat(computedStyle.paddingRight || '0') || 0
    const paddingBottom = Number.parseFloat(computedStyle.paddingBottom || '0') || 0
    const contentTop = containerRect.top + paddingTop - container.scrollTop
    const contentLeft = containerRect.left + paddingLeft
    const contentWidth = Math.max(0, containerRect.width - paddingLeft - paddingRight)
    const contentRight = contentLeft + contentWidth
    const nextMap = new Map<Id, { top: number; bottom: number }>()
    const items: ColumnPositionSnapshot['items'] = []
    let maxBottom = 0
    const nodes = Array.from(container.querySelectorAll<HTMLElement>('[data-task-id]'))
    for (const node of nodes) {
      const rawId = node.dataset.taskId
      if (!rawId) continue
      const top = node.offsetTop
      const bottom = top + node.offsetHeight
      const id = rawId as Id
      nextMap.set(id, { top, bottom })
      items.push({ id, top, bottom })
      if (bottom > maxBottom) maxBottom = bottom
    }
    positionMapRef.current = nextMap
    const dropBuffer = 24
    const contentBottom = contentTop + maxBottom + paddingBottom + dropBuffer
    onPositionsChange?.(columnId, {
      containerTop: contentTop,
      containerBottom: contentBottom,
      containerLeft: contentLeft,
      containerRight: contentRight,
      items,
    })
  }, [columnId, onPositionsChange, tasks])

  useLayoutEffect(() => {
    if (!shouldMeasure) return
    measurePositions()
  }, [measurePositions, shouldMeasure, tasks])

  useEffect(() => {
    if (!isDragging) return
    const container = listRef.current
    if (!container) return
    const scrollParent = container.closest('[data-kanban-scroll]') as HTMLElement | null
    if (!scrollParent) return

    let rafId: number | null = null
    const handleScroll = () => {
      if (rafId != null) return
      rafId = requestAnimationFrame(() => {
        rafId = null
        measurePositions()
      })
    }

    scrollParent.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)

    return () => {
      scrollParent.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
      if (rafId != null) cancelAnimationFrame(rafId)
    }
  }, [isDragging, measurePositions])

  return { listRef, positionMapRef }
}
