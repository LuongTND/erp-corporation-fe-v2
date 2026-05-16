import { ShieldAlert, ArrowLeft, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth.store'

export default function ForbiddenPage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
      <div className="max-w-md space-y-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
          <ShieldAlert className="h-10 w-10 text-destructive" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">403</h1>
          <h2 className="text-xl font-semibold text-foreground">
            Không có quyền truy cập
          </h2>
          <p className="text-sm text-muted-foreground">
            Tài khoản của bạn
            {user?.role && (
              <span className="font-medium text-foreground">
                {' '}(vai trò: {user.role.toUpperCase()})
              </span>
            )}{' '}
            không có quyền truy cập trang này.
            Vui lòng liên hệ quản trị viên nếu bạn cho rằng đây là lỗi.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Về Dashboard
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              logout()
              navigate('/portal')
            }}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            Đăng xuất
          </Button>
        </div>
      </div>
    </div>
  )
}
