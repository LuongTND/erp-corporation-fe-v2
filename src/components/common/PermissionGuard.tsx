import { type ReactNode } from 'react'
import { useAuthStore } from '@/stores/auth.store'

interface Props {
  permission: string | string[]
  fallback?: ReactNode
  children: ReactNode
}

export const PermissionGuard = ({ permission, fallback = null, children }: Props) => {
  const hasPermission = useAuthStore((s) => s.hasPermission)

  const allowed = Array.isArray(permission)
    ? permission.some(hasPermission)
    : hasPermission(permission)

  return allowed ? <>{children}</> : <>{fallback}</>
}
