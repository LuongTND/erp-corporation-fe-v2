// Wrapper chung cho mọi response từ BE
export interface ApiResponse<T> {
  data: T
  message: string
  isSuccess: boolean
  statusCode: number
  errors: Record<string, string[]> | null
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Query params chung
export interface PaginationParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// Lỗi từ BE
export interface ApiError {
  message: string
  errors?: Record<string, string[]>
  statusCode: number
}
