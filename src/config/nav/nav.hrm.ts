import { ROUTES } from '@/config/routes'
import { P } from '@/config/permissionCodes'
import { Briefcase, ClipboardCheck, ClipboardList, FileText, Store, User, UserCheck, UserSearch, Users, type LucideIcon } from 'lucide-react'
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
    label: 'Flow nhu cầu tuyển',
    items: [
      { icon: Users, label: 'Phiếu đề xuất', href: ROUTES.HR.RECRUITMENT, permission: P.RECRUITMENT_REQUEST_VIEW },
      { icon: ClipboardCheck, label: 'Nhiệm vụ của tôi', href: ROUTES.HR.WORKFLOW_MY_TASKS, permission: P.WORKFLOW_TASK_VIEW },
      { icon: UserSearch, label: 'Ứng viên', href: ROUTES.HR.CANDIDATES, permission: P.RECRUITMENT_CANDIDATE_VIEW },
      { icon: Briefcase, label: 'Tin tuyển dụng', href: ROUTES.HR.JOB_POSTINGS, permission: P.RECRUITMENT_POSTING_MANAGE },
      { icon: UserCheck, label: 'Người duyệt tuyển dụng', href: ROUTES.HR.RECRUITMENT_APPROVER_CONFIGS, permission: P.RECRUITMENT_APPROVER_VIEW },
      { icon: ClipboardList, label: 'Rule phỏng vấn', href: ROUTES.HR.INTERVIEW_RULE_CONFIGS, permission: P.INTERVIEW_RULE_CONFIGS_MANAGE },
    ],
  },
  {
    label: 'Hợp đồng',
    items: [
      { icon: FileText, label: 'Hợp đồng nhân sự', href: ROUTES.HR_MANAGER.CONTRACTS, permission: P.CONTRACT_VIEW },
    ],
  },
]
