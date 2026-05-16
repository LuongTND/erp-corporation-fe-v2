import type { UserRole } from './roles'

// ──────────────────────────────────────────────────────────────
// Role-based Redirect sau khi đăng nhập thành công
// ──────────────────────────────────────────────────────────────

export const ROLE_REDIRECTS: Record<string, string> = {
  // bod: '/dashboard',
  manager: '/dashboard',
  employee: '/dashboard',
  admin: '/dashboard',
}

// ──────────────────────────────────────────────────────────────
// Portal Role Config — Cấu hình hiển thị trên trang Portal
// ──────────────────────────────────────────────────────────────

export interface PortalRoleConfig {
  id: UserRole
  label: string
  subLabel: string
  description: string
  icon: string // Tên icon từ lucide-react
  permissions: string[]
}

export const PORTAL_ROLES: PortalRoleConfig[] = [
  // {
  //   id: 'bod',
  //   label: 'Ban Giám Đốc',
  //   subLabel: 'Board of Directors',
  //   description: 'Quản lý tổng thể doanh nghiệp, xem báo cáo tổng hợp và ra quyết định chiến lược.',
  //   icon: 'Crown',
  //   permissions: [
  //     'Xem dashboard tổng quan',
  //     'Báo cáo doanh thu & chi phí',
  //     'Phê duyệt kế hoạch kinh doanh',
  //     'Quản lý nhân sự cấp cao',
  //   ],
  // },
  {
    id: 'manager',
    label: 'Quản Lý',
    subLabel: 'Manager',
    description: 'Quản lý hoạt động vận hành hàng ngày, theo dõi nhân viên và hiệu suất.',
    icon: 'Users',
    permissions: [
      'Quản lý nhân viên',
      'Phân ca & lịch làm việc',
      'Báo cáo hiệu suất',
      'Quản lý tồn kho',
    ],
  },
  {
    id: 'employee',
    label: 'Nhân Viên',
    subLabel: 'Employee',
    description: 'Truy cập các công cụ làm việc hàng ngày, quản lý task và giao tiếp nội bộ.',
    icon: 'Briefcase',
    permissions: [
      'Xem lịch làm việc',
      'Quản lý task cá nhân',
      'Chat nội bộ',
      'Gửi yêu cầu',
    ],
  },
  {
    id: 'admin',
    label: 'Quản Trị Hệ Thống',
    subLabel: 'System Administrator',
    description: 'Cấu hình hệ thống, quản lý tài khoản người dùng và phân quyền truy cập.',
    icon: 'Shield',
    permissions: [
      'Quản lý tài khoản',
      'Phân quyền truy cập',
      'Cấu hình hệ thống',
      'Xem log hoạt động',
    ],
  },
]
