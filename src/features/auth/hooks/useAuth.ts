import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth.store'
import { authService, type LoginRequest } from '@/features/auth/services/auth.service'
import { ROLE_REDIRECTS } from '@/config/auth.config'
import { ROUTES } from '@/config/routes'

export const useAuth = () => {
  const authStore = useAuthStore()
  const navigate = useNavigate()

  const login = useCallback(
    async (credentials: LoginRequest) => {
      try {
        const { accessToken, refreshToken } = await authService.login(credentials)

        if (!accessToken) throw new Error('Không nhận được Access Token từ server.')

        // Store tokens first so the profile request is authenticated
        localStorage.setItem('access_token', accessToken)
        if (refreshToken) localStorage.setItem('refresh_token', refreshToken)

        const [profile, permissions] = await Promise.all([
          authService.getProfile(),
          authService.getPermissions(),
        ])

        authStore.setAuth(
          {
            id: profile.id,
            name: profile.fullName,
            email: profile.email,
            role: profile.role ?? '',
            permissions: permissions ?? [],
            avatar: undefined,
          },
          accessToken,
          refreshToken,
        )

        toast.success('Đăng nhập thành công')

        const redirectPath = ROLE_REDIRECTS[profile.role ?? ''] || ROUTES.DASHBOARD
        navigate(redirectPath)
      } catch (error: any) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
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
      navigate(ROUTES.LOGIN)
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
