export type WorkHistoryChangeType = 'Status' | 'JobLevel' | 'Department' | 'Salary' | 'ContractType' | 'Manager'

export interface WorkHistoryItem {
  id: string
  changeType: WorkHistoryChangeType
  changeTypeLabel: string
  oldValue: string | null
  newValue: string | null
  note: string | null
  changedBy: string | null
  changedAt: string
}
