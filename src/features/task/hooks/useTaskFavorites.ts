import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'task_favorites'

export function useTaskFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
  }, [favorites])

  const toggleFavorite = useCallback((taskId: string) => {
    setFavorites((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [taskId, ...prev]
    )
  }, [])

  const isFavorite = useCallback((taskId: string) => favorites.includes(taskId), [favorites])

  return { favorites, toggleFavorite, isFavorite }
}
