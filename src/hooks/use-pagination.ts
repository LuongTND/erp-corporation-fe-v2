import { useState } from 'react'
import type { PaginationParams } from '@/types/api'

interface UsePaginationOptions {
  initialPage?: number
  initialLimit?: number
}

export function usePagination({ initialPage = 1, initialLimit = 20 }: UsePaginationOptions = {}) {
  const [page, setPage] = useState(initialPage)
  const [limit, setLimit] = useState(initialLimit)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<string | undefined>()
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const params: PaginationParams = { page, limit, search, sortBy, sortOrder }

  const resetPage = () => setPage(1)

  const handleSearch = (value: string) => {
    setSearch(value)
    resetPage()
  }

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
    resetPage()
  }

  return {
    params,
    page, setPage,
    limit, setLimit,
    search, handleSearch,
    sortBy, sortOrder, handleSort,
  }
}
