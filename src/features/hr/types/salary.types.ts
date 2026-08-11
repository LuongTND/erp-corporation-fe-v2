export interface SalaryRecord {
  id: string
  userId: string
  fullName: string
  hourlyRate: number
  effectiveFrom: string
  effectiveTo: string | null
  reason: string | null
}

export interface SetSalaryPayload {
  hourlyRate: number
  effectiveFrom: string
  reason?: string
}
