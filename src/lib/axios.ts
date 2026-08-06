import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/stores/auth.store'
import { ROUTES } from '@/config/routes'

type PendingRequest = {
  resolve: (token: string) => void
  reject: (error: unknown) => void
}

// ──────────────────────────────────────────────────────────────
// Config & Instance
// ──────────────────────────────────────────────────────────────

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30_000,
  headers: { 'Content-Type': 'application/json' },
})

// ──────────────────────────────────────────────────────────────
// Token Management
// ──────────────────────────────────────────────────────────────

let isRefreshing = false
let pendingRequests: PendingRequest[] = []

const getAccessToken = (): string | null => localStorage.getItem('access_token')
const getRefreshToken = (): string | null => localStorage.getItem('refresh_token')

const setTokens = (accessToken: string, refreshToken?: string): void => {
  localStorage.setItem('access_token', accessToken)
  if (refreshToken) localStorage.setItem('refresh_token', refreshToken)
}

const redirectToLogin = (): void => {
  useAuthStore.getState().logout()
  window.location.href = ROUTES.LOGIN
}

const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = getRefreshToken()
  if (!refreshToken) throw new Error('No refresh token available')

  const { data } = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
    RefreshToken: refreshToken,
  })

  setTokens(data.data.accessToken, data.data.refreshToken)
  return data.data.accessToken
}

const processPendingRequests = (token: string): void => {
  pendingRequests.forEach((req) => req.resolve(token))
  pendingRequests = []
}

const handleTokenRefresh = async (): Promise<string> => {
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      pendingRequests.push({ resolve, reject })
    })
  }

  isRefreshing = true
  try {
    const newToken = await refreshAccessToken()
    setTokens(newToken)
    // Sync permissions after token refresh (fire-and-forget, non-blocking)
    api
      .get<{ data: string[] }>('/api/auth/me/permissions', {
        headers: { Authorization: `Bearer ${newToken}` },
      })
      .then((res) => useAuthStore.getState().setPermissions(res.data.data))
      .catch((err) => console.error('[auth] permission sync failed after token refresh:', err))
    processPendingRequests(newToken)
    return newToken
  } catch (error) {
    pendingRequests.forEach((req) => req.reject(error))
    pendingRequests = []
    redirectToLogin()
    throw error
  } finally {
    isRefreshing = false
  }
}

// ──────────────────────────────────────────────────────────────
// Request Interceptor
// ──────────────────────────────────────────────────────────────

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ──────────────────────────────────────────────────────────────
// Response Interceptor
// ──────────────────────────────────────────────────────────────

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // Token hết hạn → refresh & retry
    if (error.response?.status === 401 && !originalRequest?._retry && getRefreshToken()) {
      originalRequest._retry = true
      try {
        const newToken = await handleTokenRefresh()
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return api(originalRequest)
      } catch {
        return Promise.reject(error)
      }
    }

    // 403 Forbidden → redirect
    if (error.response?.status === 403) {
      window.location.href = ROUTES.FORBIDDEN
    }

    // Network error hoặc server error
    if (!error.response) {
      console.error('Network error:', error.message)
    }

    return Promise.reject(error)
  }
)
