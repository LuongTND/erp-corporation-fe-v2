import * as React from 'react'
import { isAfter, isBefore } from 'date-fns'
import { applyTimePreserved } from '../utils/date-picker.utils'
import type { ActiveFieldType, TimeFormatType } from '../types/date-picker.types'

interface UseTaskDatePickerProps {
  startDate?: Date
  dueDate?: Date
  onStartDateChange?: (date: Date | undefined) => void
  onDueDateChange?: (date: Date | undefined) => void
}

export function useTaskDatePicker({
  startDate,
  dueDate,
  onStartDateChange,
  onDueDateChange,
}: UseTaskDatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(startDate || new Date())
  const [endDate, setEndDate] = React.useState<Date | undefined>(dueDate || undefined)
  const [activeField, setActiveField] = React.useState<ActiveFieldType>('start')

  const [endDateEnabled, setEndDateEnabled] = React.useState(!!dueDate)
  const [includeTime, setIncludeTime] = React.useState(false)
  const [timeFormat, setTimeFormat] = React.useState<TimeFormatType>('12h')
  const [open, setOpen] = React.useState(false)
  const didInitEndDateRef = React.useRef(false)

  React.useEffect(() => {
    setDate(startDate)
  }, [startDate])

  React.useEffect(() => {
    setEndDate(dueDate)
    if (!didInitEndDateRef.current) {
      setEndDateEnabled(!!dueDate)
      didInitEndDateRef.current = true
    }
  }, [dueDate])

  const updateStartDate = React.useCallback(
    (next: Date | undefined) => {
      setDate(next)
      onStartDateChange?.(next)
    },
    [onStartDateChange],
  )

  const updateEndDate = React.useCallback(
    (next: Date | undefined) => {
      setEndDate(next)
      onDueDateChange?.(next)
    },
    [onDueDateChange],
  )

  const handleDayClick = React.useCallback(
    (day: Date) => {
      if (!endDateEnabled) {
        const newStartDate = applyTimePreserved(date, day)
        updateStartDate(newStartDate)
        setActiveField('start')
        return
      }

      if (activeField === 'start') {
        const newStartDate = applyTimePreserved(date, day)
        updateStartDate(newStartDate)

        if (endDateEnabled) {
          if (endDate && isAfter(day, endDate)) {
            updateEndDate(undefined)
          }
          setActiveField('end')
        }
      } else {
        if (date && isBefore(day, date)) {
          const newStartDate = applyTimePreserved(date, day)
          updateStartDate(newStartDate)
          setActiveField('start')
        } else {
          const newEndDate = applyTimePreserved(endDate, day)
          updateEndDate(newEndDate)
        }
      }
    },
    [activeField, date, endDate, endDateEnabled, updateStartDate, updateEndDate],
  )

  const handleToggleEndDate = React.useCallback(
    (checked: boolean) => {
      setEndDateEnabled(checked)
      if (!checked) {
        updateEndDate(undefined)
        setActiveField('start')
      } else {
        if (date && !endDate) {
          updateEndDate(date)
        }
        setActiveField('end')
      }
    },
    [date, endDate, updateEndDate],
  )

  const handleClear = React.useCallback(() => {
    updateStartDate(undefined)
    updateEndDate(undefined)
    setEndDateEnabled(false)
    setActiveField('start')
  }, [updateStartDate, updateEndDate])

  return {
    state: { date, endDate, activeField, endDateEnabled, includeTime, timeFormat, open },
    actions: {
      setOpen,
      setActiveField,
      setIncludeTime,
      setTimeFormat,
      updateStartDate,
      updateEndDate,
      handleDayClick,
      handleToggleEndDate,
      handleClear,
    },
  }
}
