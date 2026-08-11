export interface QueryResult<T> {
  items: T[]
  totalCount: number
}

export interface RoleResponse {
  id: string
  roleName: string
  displayName?: string
  description?: string
  isSystemRole: boolean
  permissions: PermissionResponse[]
}

export interface PermissionResponse {
  id: string
  permissionCode: string
  module: string
  description?: string
}

export interface DepartmentResponse {
  id: string
  departmentName: string
  departmentCode: string
  parentDepartmentId?: string
  parentDepartmentName?: string
  isActive: boolean
}

export interface JobLevelResponse {
  id: string
  levelName: string
  levelOrder: number
  defaultScopeType: ScopeType
  description?: string
  isDeleted: boolean
  employeeCount: number
}

// ponytail: BE uses JsonStringEnumConverter globally → enum serialized as string, not int
export type ScopeType = 'Own' | 'Team' | 'Department' | 'All'

export const SCOPE_TYPE_LABELS: Record<ScopeType, string> = {
  Own: 'Cá nhân',
  Team: 'Nhóm',
  Department: 'Phòng ban',
  All: 'Toàn bộ',
}

export interface RoleNode {
  id: string
  roleName: string
  displayName?: string
  description?: string
  isSystemRole: boolean
  permissionCount: number
  permissions: PermissionResponse[]
  children: RoleNode[]
}

export interface DepartmentTreeResponse {
  id: string
  departmentName: string
  departmentCode: string
  parentDepartmentId?: string
  managerId?: string
  managerName?: string
  managerAvatarUrl?: string
  isActive: boolean
  memberCount: number
  children: DepartmentTreeResponse[]
}

export interface DepartmentMemberResponse {
  userDepartmentId: string
  userId: string
  fullName: string
  employeeCode: string
  email: string
  avatarUrl?: string
  jobLevelId?: string
  jobLevelName?: string
  jobLevelOrder?: number
  isPrimary: boolean
  startDate: string
}

export interface AddDepartmentMemberPayload {
  departmentId: string
  startDate: string
  jobLevelId?: string
}

export interface AddBulkDepartmentMembersPayload {
  userIds: string[]
  startDate: string
}

export interface UpdateDepartmentMemberPayload {
  jobLevelId: string | null
}

export interface UserSummaryResponse {
  id: string
  fullName: string
  employeeCode: string
  email: string
  avatarUrl?: string
  status: string
  joinDate: string
}

export type Gender = 'Male' | 'Female' | 'Other'

export const GENDER_LABELS: Record<Gender, string> = {
  Male: 'Nam',
  Female: 'Nữ',
  Other: 'Khác',
}

export type ContractType = 'Probation' | 'FullTime' | 'PartTime' | 'Seasonal' | 'Freelance'

export const CONTRACT_TYPE_LABELS: Record<ContractType, string> = {
  Probation: 'Thử việc',
  FullTime: 'Toàn thời gian',
  PartTime: 'Bán thời gian',
  Seasonal: 'Thời vụ',
  Freelance: 'Cộng tác viên',
}

export interface CreateEmployeePayload {
  fullName: string
  email: string
  jobLevelId: string
  dateOfJoin: string
  employeeCode?: string
  gender?: Gender
  dateOfBirth?: string
  identityCardNumber?: string
  identityCardIssuedDate?: string
  identityCardIssuedPlace?: string
  phoneNumber?: string
  permanentAddress?: string
  currentAddress?: string
  taxCode?: string
  socialInsuranceCode?: string
  managerId?: string
  contractType?: ContractType
  bankName?: string
  bankAccountNumber?: string
  customFieldValues?: Record<string, string>
}

export type CustomFieldType = 'Text' | 'Number' | 'Date' | 'Select' | 'MultiSelect' | 'Checkbox' | 'TextArea'
export type ValidationType = 'Email' | 'Phone' | 'CitizenId' | 'TaxCode' | 'Passport' | 'EmployeeCode'

export const FIELD_TYPE_LABELS: Record<CustomFieldType, string> = {
  Text: 'Văn bản',
  Number: 'Số',
  Date: 'Ngày',
  Select: 'Chọn một',
  MultiSelect: 'Chọn nhiều',
  Checkbox: 'Checkbox',
  TextArea: 'Đoạn văn',
}

export interface CustomFieldOptionResponse {
  id: string
  value: string
  label: string
  sortOrder: number
  isActive: boolean
}

export interface CustomFieldDefinitionResponse {
  id: string
  code: string
  name: string
  fieldType: CustomFieldType
  module: string
  isSystem: boolean
  isRequired: boolean
  isActive: boolean
  sortOrder: number
  placeholder?: string
  helpText?: string
  group?: string
  validationJson?: string
  options: CustomFieldOptionResponse[]
}

export interface CreateCustomFieldPayload {
  code: string
  name: string
  fieldType: CustomFieldType
  module: string
  isRequired: boolean
  sortOrder: number
  placeholder?: string
  helpText?: string
  group?: string
  validationJson?: string
  options?: { value: string; label: string; sortOrder: number }[]
}

export interface UpdateCustomFieldPayload {
  name: string
  isRequired: boolean
  isActive: boolean
  sortOrder: number
  placeholder?: string
  helpText?: string
  group?: string
  validationJson?: string
  options?: { id?: string; value: string; label: string; sortOrder: number; isActive: boolean }[]
}

// PascalCase to match BE QueryInfo model
export interface ListParams {
  Top?: number
  Skip?: number
  SearchText?: string
  IsActive?: boolean
  NeedTotalCount?: boolean
}
