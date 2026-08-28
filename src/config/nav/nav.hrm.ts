import { ROUTES } from '@/config/routes'
import { P } from '@/config/permissionCodes'
import { Briefcase, FileText, Store, User, UserSearch, Users, type LucideIcon } from 'lucide-react'
import type { NavSection } from './nav.admin'

export const hrmNav: NavSection[] = [
  {
    label: 'Cá nhân',
    items: [
      { icon: User, label: 'Hồ sơ của tôi', href: ROUTES.PROFILE, permission: P.USERS_UPDATE_PROFILE },
    ],
  },
  {
    label: 'Quản lý cửa hàng',
    items: [
      { icon: Store, label: 'Cửa hàng của tôi', href: ROUTES.STORE_MANAGER, permission: P.STORE_MANAGER_VIEW },
    ],
  },
  {
    label: 'Tuyển dụng',
    items: [
      { icon: Users, label: 'Phiếu đề xuất', href: ROUTES.HR.RECRUITMENT, permission: P.RECRUITMENT_REQUEST_VIEW },
      { icon: UserSearch, label: 'Ứng viên', href: ROUTES.HR.CANDIDATES, permission: P.RECRUITMENT_CANDIDATE_VIEW },
      { icon: Briefcase, label: 'Tin tuyển dụng', href: ROUTES.HR.JOB_POSTINGS, permission: P.RECRUITMENT_POSTING_MANAGE },
    ],
  },
  {
    label: 'Hợp đồng',
    items: [
      { icon: FileText, label: 'Hợp đồng nhân sự', href: ROUTES.HR_MANAGER.CONTRACTS, permission: P.CONTRACT_VIEW },
    ],
  },
]
