import { api } from './axios'
import { AxiosError } from 'axios'
import type { ApiResponse } from '@/types/api'

// ──────────────────────────────────────────────────────────────
// API Call Utilities — unwraps BE ApiResponse<T> → T
// ──────────────────────────────────────────────────────────────

export const apiCall = {
  get: async <T = unknown>(url: string, config?: any): Promise<T> => {
    const response = await api.get<ApiResponse<T>>(url, config)
    return response.data.data
  },

  post: async <T = unknown>(url: string, data?: any, config?: any): Promise<T> => {
    const response = await api.post<ApiResponse<T>>(url, data, config)
    return response.data.data
  },

  put: async <T = unknown>(url: string, data?: any, config?: any): Promise<T> => {
    const response = await api.put<ApiResponse<T>>(url, data, config)
    return response.data.data
  },

  patch: async <T = unknown>(url: string, data?: any, config?: any): Promise<T> => {
    const response = await api.patch<ApiResponse<T>>(url, data, config)
    return response.data.data
  },

  delete: async <T = unknown>(url: string, config?: any): Promise<T> => {
    const response = await api.delete<ApiResponse<T>>(url, config)
    return response.data.data
  },
}

// ──────────────────────────────────────────────────────────────
// Error Handler
// ──────────────────────────────────────────────────────────────

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || error.message || 'Có lỗi xảy ra'
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'Có lỗi không xác định'
}

export const isNetworkError = (error: unknown): boolean => {
  return error instanceof AxiosError && !error.response
}
