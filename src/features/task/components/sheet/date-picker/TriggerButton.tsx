import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { enUS } from 'date-fns/locale'
import type { TimeFormatType } from '@/features/task/types/date-picker.types'

const DATE_FORMAT = 'MMM d, yyyy'
const TIME_FORMAT_12 = 'hh:mm aa'
const TIME_FORMAT_24 = 'HH:mm'

interface TriggerButtonProps {
  date: Date | undefined
  endDate: Date | undefined
  endDateEnabled: boolean
  includeTime: boolean
  timeFormat: TimeFormatType
}

export function TriggerButton({
  date,
  endDate,
  endDateEnabled,
  includeTime,
  timeFormat,
}: TriggerButtonProps) {
  if (!date) {
    return (
      <span className="flex items-center gap-2">
        <CalendarIcon className="mr-1 h-4 w-4" /> Pick a date
      </span>
    )
  }

  const currentTimeFormat = timeFormat === '24h' ? TIME_FORMAT_24 : TIME_FORMAT_12
  const shouldShowTime = includeTime && timeFormat !== 'hidden'

  return (
    <span className="text-sm flex items-center gap-1">
      <CalendarIcon className="mr-1 h-4 w-4 text-muted-foreground" />
      <span>{format(date, DATE_FORMAT, { locale: enUS })}</span>

      {shouldShowTime && (
        <span className="text-muted-foreground text-xs ml-0.5">
          {format(date, currentTimeFormat, { locale: enUS })}
        </span>
      )}

      {endDateEnabled && endDate && (
        <>
          <span className="text-muted-foreground mx-1">-&gt;</span>
          <span>{format(endDate, DATE_FORMAT, { locale: enUS })}</span>
          {shouldShowTime && (
            <span className="text-muted-foreground text-xs ml-0.5">
              {format(endDate, currentTimeFormat, { locale: enUS })}
            </span>
          )}
        </>
      )}
    </span>
  )
}
