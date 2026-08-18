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

export interface UserProfileResponse {
  id: string
  fullName: string
  email: string
  role: string | null
  status: string
  lastLoginAt: string | null
  emailVerified: boolean
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

  logout: async () => {
    return apiCall.post('/api/auth/logout')
  },

  getProfile: async () => {
    return apiCall.get<UserProfileResponse>('/api/auth/me')
  },

  updateProfile: async (data: any) => {
    return apiCall.patch('/api/auth/profile', data)
  },

  getPermissions: async () => {
    return apiCall.get<string[]>('/api/auth/me/permissions')
  },
}
