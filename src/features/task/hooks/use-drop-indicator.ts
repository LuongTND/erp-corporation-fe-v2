import { useMemo } from 'react'
import type { CSSProperties, MutableRefObject } from 'react'
import type { Id, Task } from '../types/task.types'

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
