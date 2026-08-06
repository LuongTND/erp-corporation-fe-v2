export interface UserProfileDto {
  gender?: string
  dateOfBirth?: string
  phoneNumber?: string
  permanentAddress?: string
  currentAddress?: string
}

export interface UserIdentityDto {
  identityCardNumber?: string
  identityCardIssuedDate?: string
  identityCardIssuedPlace?: string
  passportNumber?: string
  passportExpiryDate?: string
}

export interface UserEmploymentDto {
  dateOfJoin: string
  contractType?: string
  taxCode?: string
  socialInsuranceCode?: string
  bankName?: string
  bankAccountNumber?: string
  bankBranch?: string
}

export interface CustomFieldValueDto {
  definitionId: string
  code: string
  name: string
  fieldType: string
  group?: string
  sortOrder: number
  value: string
}

export interface UserDetailDto {
  id: string
  employeeCode: string
  fullName: string
  email: string
  avatarUrl?: string
  status: string
  isActive: boolean
  jobLevelId: string
  jobLevelName?: string
  managerId?: string
  managerName?: string
  profile?: UserProfileDto
  identity?: UserIdentityDto
  employment?: UserEmploymentDto
  customFields: CustomFieldValueDto[]
}

export interface UpdateEmployeePayload {
  fullName: string
  jobLevelId: string
  managerId?: string
  // Profile
  gender?: string
  dateOfBirth?: string
  phoneNumber?: string
  permanentAddress?: string
  currentAddress?: string
  // Identity
  identityCardNumber?: string
  identityCardIssuedDate?: string
  identityCardIssuedPlace?: string
  passportNumber?: string
  passportExpiryDate?: string
  // Employment
  dateOfJoin?: string
  contractType?: string
  taxCode?: string
  socialInsuranceCode?: string
  bankName?: string
  bankAccountNumber?: string
  bankBranch?: string
}
