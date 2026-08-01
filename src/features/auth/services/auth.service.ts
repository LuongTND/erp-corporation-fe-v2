import { apiCall } from '@/lib/api'

// ──────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

// ──────────────────────────────────────────────────────────────
// Auth Service
// ──────────────────────────────────────────────────────────────

export const authService = {
  login: async (credentials: LoginRequest) => {
    return apiCall.post<LoginResponse>('/api/auth/login', credentials)
  },

  refreshToken: async (token: string) => {
    return apiCall.post<LoginResponse>('/api/auth/refresh', { token })
  },

  logout: async (token?: string) => {
    return apiCall.post('/api/auth/revoke', { token })
  },

  getProfile: async () => {
    return apiCall.get('/api/auth/me')
  },

  updateProfile: async (data: any) => {
    return apiCall.patch('/api/auth/profile', data)
  },
}
