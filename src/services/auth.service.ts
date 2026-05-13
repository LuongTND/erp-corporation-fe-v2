import { apiCall } from '@/lib/api'

// ──────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  access_token: string
  refresh_token: string
  user: {
    id: string
    email: string
    name: string
  }
}

// ──────────────────────────────────────────────────────────────
// Auth Service
// ──────────────────────────────────────────────────────────────

export const authService = {
  login: async (credentials: LoginRequest) => {
    return apiCall.post<AuthResponse>('/auth/login', credentials)
  },

  register: async (data: any) => {
    return apiCall.post<AuthResponse>('/auth/register', data)
  },

  logout: async () => {
    return apiCall.post('/auth/logout')
  },

  getProfile: async () => {
    return apiCall.get('/auth/profile')
  },

  updateProfile: async (data: any) => {
    return apiCall.patch('/auth/profile', data)
  },
}
