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
  token: string
  refreshToken: string
  expiry: string
  employeeCode: string
  fullName: string
  userId: string
  // alias for compatibility
  accessToken?: string
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
