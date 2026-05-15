import { useCallback, useEffect, useLayoutEffect, useRef, useMemo } from 'react'
import type { CSSProperties, MutableRefObject } from 'react'
import type { ColumnPositionSnapshot } from './use-kanban-dnd'
import type { Id, Task } from '../types/task.types'

// ─── useColumnMeasurements ───────────────────────────────────────────────────

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

// ─── useDropIndicator ────────────────────────────────────────────────────────

interface UseDropIndicatorArgs {
  listRef: MutableRefObject<HTMLDivElement | null>
  positionMapRef: MutableRefObject<Map<Id, { top: number; bottom: number }>>
  showHint: boolean
  hintIndex: number | null
  tasks: Task[]
  effectiveTasks: Task[]
}

export function useDropIndicator({
  listRef,
  positionMapRef,
  showHint,
  hintIndex,
  tasks,
  effectiveTasks,
}: UseDropIndicatorArgs) {
  const indicatorStyle = useMemo((): CSSProperties | null => {
    if (!showHint || hintIndex == null) return null

    const container = listRef.current
    if (!container) return null

    const getCardElement = () => {
      if (tasks.length > 0) {
        const taskId = tasks[0]?.id
        return taskId
          ? container.querySelector<HTMLElement>(`[data-task-id="${String(taskId)}"]`)
          : null
      }
      return null
    }

    const cardEl = getCardElement()
    const containerRect = container.getBoundingClientRect()
    let cardLeft = 0
    let cardWidth = container.offsetWidth

    if (cardEl) {
      const cardRect = cardEl.getBoundingClientRect()
      cardLeft = cardRect.left - containerRect.left
      cardWidth = cardRect.width
    } else {
      const computedStyle = window.getComputedStyle(container)
      const paddingLeft = Number.parseFloat(computedStyle.paddingLeft || '0') || 0
      const paddingRight = Number.parseFloat(computedStyle.paddingRight || '0') || 0
      cardLeft = paddingLeft
      cardWidth = container.offsetWidth - paddingLeft - paddingRight
    }

    if (effectiveTasks.length === 0) {
      return {
        position: 'absolute',
        left: cardLeft,
        width: cardWidth,
        top: 0,
      }
    }

    const cachedPositions = positionMapRef.current
    let targetTop: number | null = null
    if (hintIndex >= effectiveTasks.length) {
      const lastId = effectiveTasks[effectiveTasks.length - 1]?.id
      const cached = lastId ? cachedPositions.get(lastId) : null
      if (cached) targetTop = cached.bottom
    } else {
      const targetId = effectiveTasks[hintIndex]?.id
      const cached = targetId ? cachedPositions.get(targetId) : null
      if (cached) targetTop = cached.top
    }

    if (targetTop == null) {
      if (hintIndex >= effectiveTasks.length) {
        const lastId = effectiveTasks[effectiveTasks.length - 1]?.id
        const lastEl = lastId
          ? container.querySelector<HTMLElement>(`[data-task-id="${String(lastId)}"]`)
          : null
        if (lastEl) {
          const rect = lastEl.getBoundingClientRect()
          targetTop = rect.bottom - containerRect.top
        }
      } else {
        const targetId = effectiveTasks[hintIndex]?.id
        const targetEl = targetId
          ? container.querySelector<HTMLElement>(`[data-task-id="${String(targetId)}"]`)
          : null
        if (targetEl) {
          const rect = targetEl.getBoundingClientRect()
          targetTop = rect.top - containerRect.top
        }
      }
    }

    if (targetTop == null) return null

    const marginOffset = 8
    return {
      position: 'absolute',
      left: cardLeft,
      width: cardWidth,
      top: Math.max(0, targetTop - marginOffset),
    }
  }, [effectiveTasks, hintIndex, listRef, positionMapRef, showHint, tasks])

  return indicatorStyle
}
