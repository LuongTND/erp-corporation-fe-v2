import { useEffect } from 'react'
import { useDndContext } from '@dnd-kit/core'
import type { Id } from '@/features/task/types/task.types'

interface KanbanDroppableMeasurerProps {
  columnIds: Id[]
}

export function KanbanDroppableMeasurer({ columnIds }: KanbanDroppableMeasurerProps) {
  const { measureDroppableContainers } = useDndContext()

  useEffect(() => {
    const scrollParent = document.querySelector<HTMLElement>('[data-kanban-scroll]')
    if (!scrollParent) return

    let rafId: number | null = null
    const handleScroll = () => {
      if (rafId != null) return
      rafId = requestAnimationFrame(() => {
        rafId = null
        measureDroppableContainers(columnIds)
      })
    }

    scrollParent.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)

    return () => {
      scrollParent.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
      if (rafId != null) cancelAnimationFrame(rafId)
    }
  }, [columnIds, measureDroppableContainers])

  return null
}
