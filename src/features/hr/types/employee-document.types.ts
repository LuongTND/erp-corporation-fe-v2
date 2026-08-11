export const DOCUMENT_CATEGORIES = [
  { value: 'IdentityCard',          label: 'CCCD / CMND',              hasExpiry: false },
  { value: 'HouseholdBook',         label: 'Hộ khẩu / KT3',            hasExpiry: false },
  { value: 'JudicialRecord',        label: 'Lý lịch tư pháp',          hasExpiry: false },
  { value: 'HealthCertificate',     label: 'Phiếu khám sức khỏe',      hasExpiry: true  },
  { value: 'RecruitmentDecision',   label: 'Quyết định tuyển dụng',    hasExpiry: false },
  { value: 'ProbationContract',     label: 'Hợp đồng thử việc',        hasExpiry: false },
  { value: 'LaborContract',         label: 'Hợp đồng lao động',        hasExpiry: true  },
  { value: 'Degree',                label: 'Bằng tốt nghiệp',          hasExpiry: false },
  { value: 'Certificate',           label: 'Chứng chỉ',                hasExpiry: true  },
  { value: 'DriversLicense',        label: 'Giấy phép lái xe',         hasExpiry: true  },
  { value: 'FoodSafetyCertificate', label: 'Chứng chỉ ATTP',           hasExpiry: true  },
  { value: 'AppointmentDecision',   label: 'Quyết định bổ nhiệm',      hasExpiry: false },
  { value: 'TransferDecision',      label: 'Quyết định điều chuyển',   hasExpiry: false },
  { value: 'Other',                 label: 'Khác',                     hasExpiry: false },
] as const

export type DocumentCategoryValue = typeof DOCUMENT_CATEGORIES[number]['value']

export interface EmployeeDocumentResponse {
  id: string
  category: string
  customName?: string
  displayName: string
  originalFileName: string
  contentType: string
  fileSizeBytes: number
  fileUrl: string
  issuedDate?: string
  expiryDate?: string
  notes?: string
  createdAt: string
  isExpired: boolean
  isExpiringSoon: boolean
}

export interface UploadDocumentPayload {
  file: File
  category: string
  customName?: string
  issuedDate?: string
  expiryDate?: string
  notes?: string
}
