import { apiCall } from '@/lib/api'
import { API_ROUTES } from '@/config/api-routes'
import type { UserDetailDto, UpdateMyProfilePayload } from '@/features/hr/types/user-detail.types'
import type { SalaryRecord } from '@/features/hr/types/salary.types'

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
  avatarUrl?: string
  status: string
  lastLoginAt: string | null
  emailVerified: boolean
}

// ──────────────────────────────────────────────────────────────
// Auth Service
// ──────────────────────────────────────────────────────────────

export const authService = {
  login: async (credentials: LoginRequest) =>
    apiCall.post<LoginResponse>(API_ROUTES.AUTH.LOGIN, credentials),

  refreshToken: async (token: string) =>
    apiCall.post<LoginResponse>(API_ROUTES.AUTH.REFRESH, { token }),

  logout: async () =>
    apiCall.post(API_ROUTES.AUTH.LOGOUT),

  getProfile: async () =>
    apiCall.get<UserProfileResponse>(API_ROUTES.AUTH.ME),

  updateProfile: async (data: unknown) =>
    apiCall.patch(API_ROUTES.AUTH.ME, data),

  getPermissions: async () =>
    apiCall.get<string[]>(API_ROUTES.AUTH.PERMISSIONS),

  // Hồ sơ đầy đủ (phòng ban, hợp đồng, v.v.) — chỉ JWT, không cần permission
  getMyDetail: async () =>
    apiCall.get<UserDetailDto>(API_ROUTES.AUTH.ME_DETAIL),

  // Lương hiện tại — chỉ JWT, không cần permission
  getMyCurrentSalary: async () =>
    apiCall.get<SalaryRecord | null>(API_ROUTES.AUTH.ME_SALARY),

  // Nhân viên tự cập nhật cá nhân / giấy tờ / tài chính
  updateMyProfile: async (data: UpdateMyProfilePayload) =>
    apiCall.patch(API_ROUTES.AUTH.ME_PROFILE, data),
}
