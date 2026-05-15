import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'task_recents'
const MAX_RECENTS = 8

export function useTaskRecents() {
  const [recents, setRecents] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recents))
  }, [recents])

  const pushRecent = useCallback((taskId: string) => {
    setRecents((prev) => {
      const filtered = prev.filter((id) => id !== taskId)
      return [taskId, ...filtered].slice(0, MAX_RECENTS)
    })
  }, [])

  return { recents, pushRecent }
}
