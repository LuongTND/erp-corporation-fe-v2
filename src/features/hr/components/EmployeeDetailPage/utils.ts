import type { EmployeeDetail } from '../../types/employee.types'
import type { UserDetailDto } from '../../types/user-detail.types'

export function mapToEmployeeDetail(dto: UserDetailDto): EmployeeDetail {
  const initials = dto.fullName
    .split(' ')
    .filter(Boolean)
    .slice(-2)
    .map(w => w[0])
    .join('')
    .toUpperCase()

  const managerInitials = (dto.managerName ?? '?')
    .split(' ')
    .filter(Boolean)
    .slice(-2)
    .map((w: string) => w[0])
    .join('')
    .toUpperCase()

  return {
    id: dto.id,
    employeeCode: dto.employeeCode,
    fullName: dto.fullName,
    position: dto.jobLevelName ?? '—',
    department: '—',
    employmentType: (dto.employment?.contractType === 'PartTime' ? 'Part-time'
      : dto.employment?.contractType === 'Freelance' ? 'Contract'
      : 'Full-time') as EmployeeDetail['employmentType'],
    joinDate: dto.employment?.dateOfJoin
      ? new Date(dto.employment.dateOfJoin).toLocaleDateString('vi-VN')
      : '—',
    avatarUrl: dto.avatarUrl,
    initials,
    isOnline: dto.isActive,
    dateOfBirth: dto.profile?.dateOfBirth
      ? new Date(dto.profile.dateOfBirth).toLocaleDateString('vi-VN')
      : '—',
    gender: dto.profile?.gender ?? '—',
    nationality: '—',
    personalEmail: dto.email,
    personalPhone: dto.profile?.phoneNumber ?? '—',
    idNumber: dto.identity?.identityCardNumber ?? '—',
    idExpiry: dto.identity?.identityCardIssuedDate
      ? new Date(dto.identity.identityCardIssuedDate).toLocaleDateString('vi-VN')
      : '—',
    permanentAddress: dto.profile?.permanentAddress ?? '—',
    emergencyContact: { name: '—', relationship: '—', phone: '—' },
    bankAccount: {
      bankName: dto.employment?.bankName ?? '—',
      accountNumberMasked: dto.employment?.bankAccountNumber
        ? `**** ${dto.employment.bankAccountNumber.slice(-4)}`
        : '—',
    },
    socialInsuranceNumber: dto.employment?.socialInsuranceCode ?? '—',
    taxCode: dto.employment?.taxCode ?? '—',
    manager: {
      id: dto.managerId ?? '',
      name: dto.managerName ?? '—',
      initials: managerInitials,
    },
    workLocation: 'HQ',
    workSchedule: 'T2–T6 · 08:00–17:00',
    contractType: dto.employment?.contractType ?? '—',
    contractEndDate: '—',
    salaryGrade: '—',
    salaryRange: '—',
    probationStatus: 'Completed',
    itEquipment: [],
    systemRoles: [],
  }
}
