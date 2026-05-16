import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth.store'
import { authService, type LoginRequest } from '@/services/auth.service'
import { decodeUserFromToken } from '@/features/auth/auth.utils'
import { ROLE_REDIRECTS } from '@/config/auth.config'

/**
 * Hook quản lý Authentication cho toàn bộ ứng dụng.
 *
 * Luồng Login:
 * 1. Gọi API login → nhận `{ accessToken, refreshToken }`
 * 2. Decode JWT để lấy thông tin user (id, email, name, role)
 * 3. Kiểm tra role (nếu `expectedRole` được truyền vào)
 * 4. Lưu vào Zustand store + localStorage
 * 5. Redirect dựa trên role
 */
export const useAuth = () => {
  const authStore = useAuthStore()
  const navigate = useNavigate()

  const login = useCallback(
    async (credentials: LoginRequest, expectedRole?: string) => {
      try {
        // B1: Gọi API login
        const response = await authService.login(credentials)
        const { accessToken, refreshToken } = response

        if (!accessToken) {
          throw new Error('Không nhận được Access Token từ server.')
        }

        // B2: Giải mã JWT để lấy user info
        const decodedUser = decodeUserFromToken(accessToken)
        if (!decodedUser) {
          throw new Error('Token không hợp lệ, không thể giải mã thông tin người dùng.')
        }

        // B3: Kiểm tra role nếu có yêu cầu (từ Portal Page)
        if (expectedRole) {
          const currentRole = decodedUser.role.toLowerCase()
          const required = expectedRole.toLowerCase()
          if (currentRole !== required) {
            throw new Error('Tài khoản của bạn không có quyền truy cập hệ thống này.')
          }
        }

        // B4: Lưu vào Zustand store + localStorage
        authStore.setAuth(
          {
            id: decodedUser.id,
            name: decodedUser.name,
            email: decodedUser.email,
            role: decodedUser.role,
            permissions: [],
            avatar: decodedUser.avatar,
          },
          accessToken,
          refreshToken,
        )

        toast.success('Đăng nhập thành công')

        // B5: Redirect dựa trên role
        const redirectPath = ROLE_REDIRECTS[decodedUser.role] || '/dashboard'
        navigate(redirectPath)

        return response
      } catch (error: any) {
        // Xử lý lỗi từ API hoặc logic
        const message =
          error.response?.data?.message ||
          error.message ||
          'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.'
        toast.error(message)
        throw error
      }
    },
    [authStore, navigate],
  )

  const logout = useCallback(async () => {
    try {
      const token = localStorage.getItem('access_token')
      await authService.logout(token || undefined)
    } catch (error) {
      console.error('Logout API error:', error)
    } finally {
      authStore.logout()
      toast.info('Đã đăng xuất')
      navigate('/portal')
    }
  }, [authStore, navigate])

  return {
    user: authStore.user,
    isAuthenticated: authStore.isAuthenticated,
    hasPermission: authStore.hasPermission,
    login,
    logout,
  }
}
