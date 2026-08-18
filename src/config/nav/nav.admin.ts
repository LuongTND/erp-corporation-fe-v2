import { ROUTES } from '@/config/routes'
import { P } from '@/config/permissionCodes'
import {
  BarChart3,
  Building2,
  FileText,
  FilePlus2,
  KeyRound,
  LayoutGrid,
  MapPin,
  Network,
  ScrollText,
  ShoppingBag,
  SlidersHorizontal,
  UserCog,
  Users2,
  type LucideIcon,
} from 'lucide-react'

export type NavItem = { icon: LucideIcon; label: string; href: string; permission?: string }
export type NavSection = { label: string; items: NavItem[] }

export const adminNav: NavSection[] = [
  {
    label: 'Tổ chức',
    items: [
      { icon: Building2, label: 'Phòng ban', href: ROUTES.ADMIN.DEPARTMENTS, permission: P.DEPARTMENTS_VIEW },
      { icon: ShoppingBag, label: 'Cửa hàng', href: ROUTES.ADMIN.STORES, permission: P.STORES_VIEW },
      { icon: MapPin, label: 'Khu vực', href: ROUTES.ADMIN.REGIONS, permission: P.REGIONS_VIEW },
      { icon: LayoutGrid, label: 'Quầy', href: ROUTES.ADMIN.COUNTERS, permission: P.COUNTERS_VIEW },
    ],
  },
  {
    label: 'Nhân sự',
    items: [
      { icon: Network, label: 'Nhân sự', href: ROUTES.ADMIN.EMPLOYEES, permission: P.USERS_VIEW },
      { icon: Users2, label: 'Chức danh', href: ROUTES.ADMIN.JOB_LEVELS, permission: P.JOB_LEVELS_VIEW },
      { icon: UserCog, label: 'Loại nhân sự', href: ROUTES.ADMIN.EMPLOYEE_TYPES, permission: P.EMPLOYEE_TYPES_VIEW },
      { icon: SlidersHorizontal, label: 'Trường tùy chỉnh', href: ROUTES.ADMIN.CUSTOM_FIELDS, permission: P.CUSTOM_FIELDS_READ },
    ],
  },
  {
    label: 'Hợp đồng',
    items: [
      { icon: FileText, label: 'Hợp đồng', href: ROUTES.ADMIN.CONTRACTS, permission: P.CONTRACT_VIEW },
      { icon: FilePlus2, label: 'Mẫu hợp đồng', href: ROUTES.ADMIN.CONTRACT_TEMPLATES, permission: P.CONTRACT_TEMPLATES_VIEW },
    ],
  },
  {
    label: 'Lương & KPI',
    items: [
      { icon: BarChart3, label: 'KPI & Lương', href: ROUTES.ADMIN.KPI_ENTRIES, permission: P.KPI_ENTRIES_VIEW },
    ],
  },
  {
    label: 'Hệ thống',
    items: [
      { icon: KeyRound, label: 'Vai trò', href: ROUTES.ADMIN.ACCOUNTS, permission: P.ROLES_VIEW },
      { icon: ScrollText, label: 'Nhật ký phân quyền', href: ROUTES.ADMIN.AUDIT_LOGS, permission: P.AUDIT_LOGS_VIEW },
      // ponytail: Phân cấp vai trò hidden — re-enable when backend supports parentRoleId
    ],
  },
]
