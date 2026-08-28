import type { EmployeeDetail } from '../../types/employee.types'
import type { UserDetailDto } from '../../types/user-detail.types'
import { fmtDate } from '@/lib/date'

const CONTRACT_TYPE_LABELS: Record<string, string> = {
  Probation: 'Thử việc',
  FullTime:  'Toàn thời gian',
  PartTime:  'Bán thời gian',
  Seasonal:  'Thời vụ',
  Freelance: 'Cộng tác viên',
}

function deriveProbationStatus(status: string, contractType?: string): EmployeeDetail['probationStatus'] {
  if (status === 'Probation' || contractType === 'Probation') return 'In Progress'
  if (status === 'Active' || status === 'Official') return 'Completed'
  return 'Not Applicable'
}

export function mapToEmployeeDetail(dto: UserDetailDto): EmployeeDetail {
  const initials = dto.fullName
    .split(' ')
    .filter(Boolean)
    .slice(-2)
    .map(w => w[0])
    .join('')
    .toUpperCase()

  const primaryDept = dto.departments?.find(d => d.isPrimary) ?? dto.departments?.[0]
  const resolvedManagerName = dto.managerName ?? primaryDept?.managerName
  const resolvedManagerId = dto.managerId ?? primaryDept?.managerId

  const managerInitials = (resolvedManagerName ?? '?')
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
    department: dto.departments?.find(d => d.isPrimary)?.departmentName ?? dto.departments?.[0]?.departmentName ?? '—',
    departmentId: dto.departments?.find(d => d.isPrimary)?.departmentId ?? dto.departments?.[0]?.departmentId,
    employmentType: (dto.employment?.contractType === 'PartTime' ? 'Part-time'
      : dto.employment?.contractType === 'Freelance' || dto.employment?.contractType === 'Seasonal' || dto.employment?.contractType === 'Probation' ? 'Contract'
      : 'Full-time') as EmployeeDetail['employmentType'],
    joinDate: fmtDate(dto.employment?.dateOfJoin),
    avatarUrl: dto.avatarUrl,
    initials,
    isOnline: dto.isActive,
    dateOfBirth: fmtDate(dto.profile?.dateOfBirth),
    gender: dto.profile?.gender ?? '—',
    nationality: '—',
    personalEmail: dto.email,
    personalPhone: dto.profile?.phoneNumber ?? '—',
    idNumber: dto.identity?.identityCardNumber ?? '—',
    passportNumber: dto.identity?.passportNumber ?? '—',
    idExpiry: fmtDate(dto.identity?.identityCardIssuedDate),
    permanentAddress: dto.profile?.permanentAddress ?? '—',
    bankAccount: {
      bankName: dto.employment?.bankName ?? '—',
      accountNumberMasked: dto.employment?.bankAccountNumber
        ? `**** ${dto.employment.bankAccountNumber.slice(-4)}`
        : '—',
      bankBranch: dto.employment?.bankBranch,
    },
    socialInsuranceNumber: dto.employment?.socialInsuranceCode ?? '—',
    taxCode: dto.employment?.taxCode ?? '—',
    manager: {
      id: resolvedManagerId ?? '',
      name: resolvedManagerName ?? '—',
      initials: managerInitials,
    },
    workLocation: 'HQ',
    workSchedule: 'T2–T6 · 08:00–17:00',
    contractType: CONTRACT_TYPE_LABELS[dto.employment?.contractType ?? ''] ?? dto.employment?.contractType ?? '—',
    contractEndDate: '—',
    salaryGrade: '—',
    salaryRange: '—',
    probationStatus: deriveProbationStatus(dto.status, dto.employment?.contractType),
    itEquipment: [],
    systemRoles: [],
    labels: dto.labels ?? [],
  }
}
