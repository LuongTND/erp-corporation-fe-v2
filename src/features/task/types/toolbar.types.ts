export type SortOption = 'CreatedAtUtc' | 'Title' | 'DueDate'
export type SortOrder = 'asc' | 'desc'

export interface TaskFilterParams {
  search?: string
  statusIds?: string[]
  priorityIds?: string[]
  startDateFrom?: Date
  startDateTo?: Date
  dueDateFrom?: Date
  dueDateTo?: Date
  sortBy?: SortOption
  sortOrder?: SortOrder
}
