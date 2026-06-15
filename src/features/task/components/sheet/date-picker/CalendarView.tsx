import { Calendar } from '@/components/ui/calendar'
import { enUS } from 'date-fns/locale'

interface CalendarViewProps {
  date: Date | undefined
  endDate: Date | undefined
  activeField: 'start' | 'end'
  onDayClick: (day: Date) => void
  isRangeMode: boolean
}

export function CalendarView({
  date,
  endDate,
  activeField,
  onDayClick,
  isRangeMode,
}: CalendarViewProps) {
  const commonProps = {
    onDayClick,
    defaultMonth: activeField === 'end' && endDate ? endDate : date,
    locale: enUS,
    fixedWeeks: true,
    showOutsideDays: true,
    numberOfMonths: 1,
    classNames: { today: 'bg-accent text-accent-foreground font-bold' },
  }

  return (
    <div className="flex justify-center bg-popover relative z-10">
      {isRangeMode ? (
        <Calendar mode="range" selected={{ from: date, to: endDate }} required={false} {...commonProps} />
      ) : (
        <Calendar mode="single" selected={date} required={false} {...commonProps} />
      )}
    </div>
  )
}
