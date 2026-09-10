import { ROUTES } from '@/config/routes'
import { P } from '@/config/permissionCodes'
import {
  BarChart3,
  Building2,
  ClipboardList,
  FileText,
  FilePlus2,
  GitBranch,
  KeyRound,
  LayoutGrid,
  MapPin,
  ScrollText,
  ShoppingBag,
  Sliders,
  Tag,
  TrendingUp,
  UserCheck,
  Users,
  Users2,
  type LucideIcon,
} from 'lucide-react'

export type NavItem = { icon: LucideIcon; label: string; href: string; permission?: string }
export type NavSection = { label: string; items: NavItem[] }

export const adminNav: NavSection[] = [
  {
    label: 'Mạng lưới & Tổ chức',
    items: [
      { icon: Building2, label: 'Sơ đồ phòng ban', href: ROUTES.ADMIN.DEPARTMENTS, permission: P.DEPARTMENTS_VIEW },
      { icon: MapPin, label: 'Khu vực', href: ROUTES.ADMIN.REGIONS, permission: P.REGIONS_VIEW },
      { icon: ShoppingBag, label: 'Cửa hàng', href: ROUTES.ADMIN.STORES, permission: P.STORES_VIEW },
      { icon: LayoutGrid, label: 'Quầy hàng', href: ROUTES.ADMIN.COUNTERS, permission: P.COUNTERS_VIEW },
    ],
  },
  {
    label: 'Quản trị Nhân sự',
    items: [
      { icon: Users, label: 'Hồ sơ nhân sự', href: ROUTES.ADMIN.EMPLOYEES, permission: P.USERS_VIEW },
      { icon: Users2, label: 'Chức danh & Vị trí', href: ROUTES.ADMIN.JOB_LEVELS, permission: P.JOB_LEVELS_VIEW },
      { icon: FileText, label: 'Hợp đồng lao động', href: ROUTES.ADMIN.CONTRACTS, permission: P.CONTRACT_VIEW },
      { icon: FilePlus2, label: 'Mẫu hợp đồng', href: ROUTES.ADMIN.CONTRACT_TEMPLATES, permission: P.CONTRACT_TEMPLATES_VIEW },
      { icon: Tag,       label: 'Nhãn nhân viên',          href: ROUTES.ADMIN.LABELS, permission: P.LABELS_MANAGE },
      { icon: UserCheck, label: 'Người duyệt tuyển dụng', href: ROUTES.HR.RECRUITMENT_APPROVER_CONFIGS, permission: P.RECRUITMENT_APPROVER_VIEW },
      { icon: ClipboardList, label: 'Rule phỏng vấn', href: ROUTES.HR.INTERVIEW_RULE_CONFIGS, permission: P.INTERVIEW_RULE_CONFIGS_MANAGE },
      { icon: Sliders, label: 'Thành phần hồ sơ', href: ROUTES.ADMIN.PROFILE_COMPONENTS, permission: P.EMPLOYEE_TYPES_VIEW },
    ],
  },
  {
    label: 'Hiệu suất & Lương',
    items: [
      { icon: TrendingUp, label: 'Quản lý KPI', href: ROUTES.ADMIN.KPI_ENTRIES, permission: P.KPI_ENTRIES_VIEW },
      { icon: BarChart3, label: 'Bảng lương & Đãi ngộ', href: ROUTES.ADMIN.PAYROLL_RUNS, permission: P.PAYROLL_RUNS_VIEW },
    ],
  },
  {
    label: 'Hệ thống & Phân quyền',
    items: [
      { icon: KeyRound, label: 'Vai trò & Phân quyền', href: ROUTES.ADMIN.ROLES, permission: P.ROLES_VIEW },
      { icon: ScrollText, label: 'Nhật ký thao tác', href: ROUTES.ADMIN.AUDIT_LOGS, permission: P.AUDIT_LOGS_VIEW },
      { icon: GitBranch, label: 'Workflow Templates', href: ROUTES.ADMIN.WORKFLOW_TEMPLATES, permission: P.WORKFLOW_TEMPLATE_MANAGE },
    ],
  },
]
