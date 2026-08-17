import { ROUTES } from '@/config/routes'
import { P } from '@/config/permissionCodes'
import { Store, type LucideIcon } from 'lucide-react'
import type { NavSection } from './nav.admin'

export const hrmNav: NavSection[] = [
  {
    label: 'Quản lý cửa hàng',
    items: [
      { icon: Store, label: 'Cửa hàng của tôi', href: ROUTES.STORE_MANAGER, permission: P.STORE_MANAGER_VIEW },
    ],
  },
]
