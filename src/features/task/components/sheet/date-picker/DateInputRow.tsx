import * as React from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { format, parse, isValid, set, isBefore, startOfDay } from 'date-fns'
import { enUS } from 'date-fns/locale'

import { DATE_FORMAT, getTimeFormatPattern } from '@/features/task/utils/date-picker.utils'
import type { TimeFormatType } from '@/features/task/types/date-picker.types'

interface DateInputRowProps {
  label: string
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  includeTime: boolean
  timeFormat?: TimeFormatType
  minDate?: Date
  isActive?: boolean
  onActive?: () => void
}

export function DateInputRow({
  label,
  date,
  setDate,
  includeTime,
  timeFormat = '12h',
  minDate,
  isActive,
  onActive,
}: DateInputRowProps) {
  const [dateStr, setDateStr] = React.useState('')
  const [timeStr, setTimeStr] = React.useState('')
  const [isDateInvalid, setIsDateInvalid] = React.useState(false)
  const [isTimeInvalid, setIsTimeInvalid] = React.useState(false)

  const currentTimeFormat = getTimeFormatPattern(timeFormat)
  const placeholderTime = timeFormat === '24h' ? '23:59' : '00:00 PM'
  const shouldShowTimeInput = includeTime && timeFormat !== 'hidden'

  React.useEffect(() => {
    if (date && isValid(date)) {
      setDateStr(format(date, DATE_FORMAT, { locale: enUS }))
      setTimeStr(format(date, currentTimeFormat, { locale: enUS }))
      setIsDateInvalid(false)
      setIsTimeInvalid(false)
    } else if (!date) {
      setDateStr('')
      setTimeStr('')
    }
  }, [date, currentTimeFormat])

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setDateStr(val)
    onActive?.()

    if (!val.trim()) {
      setIsDateInvalid(false)
      setIsTimeInvalid(false)
      setDate(undefined)
      return
    }

    const parsedDate = parse(val, DATE_FORMAT, new Date(), { locale: enUS })

    if (!isValid(parsedDate)) {
      setIsDateInvalid(true)
      return
    }

    if (isBefore(startOfDay(parsedDate), startOfDay(new Date()))) {
      setIsDateInvalid(true)
      return
    }

    if (minDate && isBefore(startOfDay(parsedDate), startOfDay(minDate))) {
      setIsDateInvalid(true)
      return
    }

    if (parsedDate.getFullYear() < 1000) return

    setIsDateInvalid(false)

    const newDate = date
      ? set(parsedDate, { hours: date.getHours(), minutes: date.getMinutes() })
      : parsedDate
    setDate(newDate)
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setTimeStr(val)
    onActive?.()

    if (!val.trim()) {
      setIsTimeInvalid(false)
      return
    }

    if (!date) {
      setIsTimeInvalid(false)
      return
    }

    const baseDate = date || new Date()
    const parsedTime = parse(val, currentTimeFormat, baseDate, { locale: enUS })

    if (isValid(parsedTime)) {
      setIsTimeInvalid(false)
      if (date) {
        setDate(set(date, { hours: parsedTime.getHours(), minutes: parsedTime.getMinutes() }))
      }
    } else {
      setIsTimeInvalid(true)
    }
  }

  return (
    <div
      className={cn(
        'flex gap-2 transition-all relative',
        shouldShowTimeInput ? 'flex-row' : 'flex-col',
      )}
    >
      <div className="relative flex-1 group">
        {isDateInvalid && <ErrorTooltip message="Invalid date" side="left" />}
        <Input
          placeholder={label}
          value={dateStr}
          onChange={handleDateChange}
          onFocus={onActive}
          className={cn(
            'h-8 text-sm px-2 transition-colors focus-visible:ring-0',
            isDateInvalid
              ? 'border-destructive text-destructive'
              : isActive
                ? 'border-primary ring-1 ring-primary'
                : 'focus:border-primary',
          )}
        />
      </div>

      {shouldShowTimeInput && (
        <div
          className={cn(
            'relative transition-all',
            timeFormat === '24h' ? 'w-[60px]' : 'w-[85px]',
          )}
        >
          {isTimeInvalid && <ErrorTooltip message="Invalid time" side="right" />}
          <Input
            disabled={!date}
            placeholder={placeholderTime}
            value={timeStr}
            onChange={handleTimeChange}
            onFocus={onActive}
            className={cn(
              'h-8 text-sm px-2 text-center transition-colors focus-visible:ring-0',
              isTimeInvalid ? 'border-destructive text-destructive' : 'focus:border-primary',
            )}
          />
        </div>
      )}
    </div>
  )
}

function ErrorTooltip({ message, side }: { message: string; side: 'left' | 'right' }) {
  return (
    <div
      className={cn(
        'absolute top-1/2 -translate-y-1/2 z-50 animate-in fade-in zoom-in-95',
        side === 'left' ? 'right-full mr-2' : 'left-full ml-2',
      )}
    >
      <div className="px-2 py-1 bg-destructive text-destructive-foreground text-[10px] font-bold rounded shadow-md whitespace-nowrap relative">
        {message}
        <div
          className={cn(
            'absolute top-1/2 -translate-y-1/2 w-0 h-0 border-y-[4px] border-y-transparent border-[4px]',
            side === 'left'
              ? 'right-[-4px] border-l-destructive border-r-0'
              : 'left-[-4px] border-r-destructive border-l-0',
          )}
        />
      </div>
    </div>
  )
}
