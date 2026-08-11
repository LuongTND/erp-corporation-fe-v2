export interface PayrollRunResponse {
  id: string
  month: number
  year: number
  status: 'Draft' | 'Finalized' | 'Paid'
  note?: string | null
  entryCount: number
  totalNetPay: number
  createdAt: string
}

export interface PayrollEntryResponse {
  id: string
  userId: string
  fullName: string
  hourlyRateSnapshot: number
  hoursWorked: number
  grossPay: number
  bonusAmount: number
  totalDeductions: number
  netPay: number
  socialInsurance?: number | null
  healthInsurance?: number | null
  unemploymentIns?: number | null
  personalIncomeTax?: number | null
  note?: string | null
}

export interface PayrollRunDetailResponse {
  id: string
  month: number
  year: number
  status: 'Draft' | 'Finalized' | 'Paid'
  note?: string | null
  createdAt: string
  entries: PayrollEntryResponse[]
}

export interface CreatePayrollRunPayload {
  month: number
  year: number
  note?: string
}

export interface UpdatePayrollEntryPayload {
  hoursWorked: number
  bonusAmount: number
  socialInsurance?: number | null
  healthInsurance?: number | null
  unemploymentIns?: number | null
  personalIncomeTax?: number | null
  note?: string
}
