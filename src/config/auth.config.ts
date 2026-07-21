import type { UserRole } from './roles'

// ──────────────────────────────────────────────────────────────
// Role-based Redirect sau khi đăng nhập thành công
// ──────────────────────────────────────────────────────────────

export const ROLE_REDIRECTS: Record<string, string> = {
  ROLE_SUPER_ADMIN: '/dashboard',
  ROLE_HR_ADMIN: '/dashboard',
  ROLE_EMPLOYEE: '/dashboard',
  customer: '/customer/nguyen-lieu',
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
    id: 'ROLE_HR_ADMIN',
    label: 'Quản Lý HR',
    subLabel: 'HR Administrator',
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
    id: 'ROLE_EMPLOYEE',
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
    id: 'ROLE_SUPER_ADMIN',
    label: 'Quản Trị Hệ Thống',
    subLabel: 'Super Administrator',
    description: 'Cấu hình hệ thống, quản lý tài khoản người dùng và phân quyền truy cập.',
    icon: 'Shield',
    permissions: [
      'Quản lý tài khoản',
      'Phân quyền truy cập',
      'Cấu hình hệ thống',
      'Xem log hoạt động',
    ],
  },
  {
    id: 'customer',
    label: 'Khách Hàng',
    subLabel: 'Customer',
    description: 'Truy cập cổng khách hàng tự phục vụ, đặt hàng và theo dõi ưu đãi thành viên.',
    icon: 'User',
    permissions: [
      'Tự đặt hàng (Self-Service)',
      'Theo dõi đơn hàng',
      'Xem lịch sử mua hàng',
      'Nhận ưu đãi cá nhân',
    ],
  },
]
