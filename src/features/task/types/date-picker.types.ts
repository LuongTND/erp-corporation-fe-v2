export type TimeFormatType = 'hidden' | '12h' | '24h'
export type ActiveFieldType = 'start' | 'end'

export interface TaskDatePickerProps {
  startDate?: Date | undefined
  dueDate?: Date | undefined
  onStartDateChange?: (date: Date | undefined) => void
  onDueDateChange?: (date: Date | undefined) => void
}
