import { apiCall } from '@/lib/api'

// ──────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────

export interface LoginRequest {
  email: string
  password: string
}

/**
 * Response trả về từ Backend .NET
 * Dựa trên pattern POS-BAHUNG: server trả về accessToken (JWT)
 * và refreshToken. Thông tin user được decode từ JWT.
 */
export interface LoginResponse {
  accessToken: string
  refreshToken?: string
}

// ──────────────────────────────────────────────────────────────
// Auth Service
// ──────────────────────────────────────────────────────────────

export const authService = {
  login: async (credentials: LoginRequest) => {
    return apiCall.post<LoginResponse>('/auth/login', credentials)
  },

  refreshToken: async (token: string) => {
    return apiCall.post<LoginResponse>('/auth/refresh-token', { token })
  },

  logout: async (token?: string) => {
    return apiCall.post('/auth/logout', { token })
  },

  getProfile: async () => {
    return apiCall.get('/auth/profile')
  },

  updateProfile: async (data: any) => {
    return apiCall.patch('/auth/profile', data)
  },
}
