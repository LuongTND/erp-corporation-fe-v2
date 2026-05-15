import * as React from 'react'
import { CircleHelp, ChevronRight } from 'lucide-react'
import { format, parse, isValid, set, isBefore, startOfDay, isAfter } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Calendar } from '@/components/ui/calendar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { applyTimePreserved } from '@/features/task/utils/date-picker.utils'
import type { TaskDatePickerProps, TimeFormatType, ActiveFieldType } from '@/features/task/types/task.types'

// ─── Constants ───────────────────────────────────────────────────────────────

const DATE_FORMAT = 'MM/dd/yyyy'
const TIME_FORMAT_12 = 'hh:mm aa'
const TIME_FORMAT_24 = 'HH:mm'

function getTimeFormatPattern(format: TimeFormatType) {
  return format === '24h' ? TIME_FORMAT_24 : TIME_FORMAT_12
}

// ─── TriggerButton ───────────────────────────────────────────────────────────

function TriggerButton({
  date,
  endDate,
  endDateEnabled,
  includeTime,
  timeFormat,
}: {
  date: Date | undefined
  endDate: Date | undefined
  endDateEnabled: boolean
  includeTime: boolean
  timeFormat: TimeFormatType
}) {
  if (!date) {
    return (
      <span className="text-[12px]" style={{ color: '#8e8b82' }}>Chọn ngày</span>
    )
  }

  const currentTimeFormat = timeFormat === '24h' ? TIME_FORMAT_24 : TIME_FORMAT_12
  const shouldShowTime = includeTime && timeFormat !== 'hidden'

  return (
    <span className="text-[12px] flex items-center gap-1" style={{ color: '#141413' }}>
      <span>{format(date, 'MMM d, yyyy', { locale: enUS })}</span>

      {shouldShowTime && (
        <span className="text-[11px] ml-0.5" style={{ color: '#8e8b82' }}>
          {format(date, currentTimeFormat, { locale: enUS })}
        </span>
      )}

      {endDateEnabled && endDate && (
        <>
          <span className="mx-1" style={{ color: '#8e8b82' }}>→</span>
          <span>{format(endDate, 'MMM d, yyyy', { locale: enUS })}</span>
          {shouldShowTime && (
            <span className="text-[11px] ml-0.5" style={{ color: '#8e8b82' }}>
              {format(endDate, currentTimeFormat, { locale: enUS })}
            </span>
          )}
        </>
      )}
    </span>
  )
}

// ─── ErrorTooltip ─────────────────────────────────────────────────────────────

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

// ─── DateInputRow ─────────────────────────────────────────────────────────────

function DateInputRow({
  label,
  date,
  setDate,
  includeTime,
  timeFormat = '12h',
  minDate,
  isActive,
  onActive,
}: {
  label: string
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  includeTime: boolean
  timeFormat?: TimeFormatType
  minDate?: Date
  isActive?: boolean
  onActive?: () => void
}) {
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

    if (!isValid(parsedDate)) { setIsDateInvalid(true); return }
    if (isBefore(startOfDay(parsedDate), startOfDay(new Date()))) { setIsDateInvalid(true); return }
    if (minDate && isBefore(startOfDay(parsedDate), startOfDay(minDate))) { setIsDateInvalid(true); return }
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

    if (!val.trim() || !date) { setIsTimeInvalid(false); return }

    const parsedTime = parse(val, currentTimeFormat, date, { locale: enUS })
    if (isValid(parsedTime)) {
      setIsTimeInvalid(false)
      setDate(set(date, { hours: parsedTime.getHours(), minutes: parsedTime.getMinutes() }))
    } else {
      setIsTimeInvalid(true)
    }
  }

  return (
    <div className={cn('flex gap-2 transition-all relative', shouldShowTimeInput ? 'flex-row' : 'flex-col')}>
      <div className="relative flex-1 group">
        {isDateInvalid && <ErrorTooltip message="Ngày không hợp lệ" side="left" />}
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
        <div className={cn('relative transition-all', timeFormat === '24h' ? 'w-[60px]' : 'w-[85px]')}>
          {isTimeInvalid && <ErrorTooltip message="Giờ không hợp lệ" side="right" />}
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

// ─── CalendarView ─────────────────────────────────────────────────────────────

function CalendarView({
  date,
  endDate,
  activeField,
  onDayClick,
  isRangeMode,
}: {
  date: Date | undefined
  endDate: Date | undefined
  activeField: ActiveFieldType
  onDayClick: (day: Date) => void
  isRangeMode: boolean
}) {
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

// ─── OptionsPanel ─────────────────────────────────────────────────────────────

function OptionRow({ label, control }: { label: string; control: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-3 py-1.5 hover:bg-accent/50 cursor-pointer group transition-colors">
      <span className="text-sm text-foreground/80 group-hover:text-foreground">{label}</span>
      {control}
    </div>
  )
}

function OptionsPanel({
  endDateEnabled,
  includeTime,
  timeFormat,
  onToggleEndDate,
  onToggleIncludeTime,
  onTimeFormatChange,
}: {
  endDateEnabled: boolean
  includeTime: boolean
  timeFormat: TimeFormatType
  onToggleEndDate: (checked: boolean) => void
  onToggleIncludeTime: (checked: boolean) => void
  onTimeFormatChange: (value: TimeFormatType) => void
}) {
  return (
    <div className="py-2 bg-popover relative z-10">
      <OptionRow
        label="Ngày kết thúc"
        control={<Switch checked={endDateEnabled} onCheckedChange={onToggleEndDate} className="scale-75" />}
      />
      <OptionRow
        label="Bao gồm giờ"
        control={<Switch checked={includeTime} onCheckedChange={onToggleIncludeTime} className="scale-75" />}
      />
      <OptionRow
        label="Định dạng ngày"
        control={
          <span className="text-xs text-muted-foreground flex items-center gap-1 cursor-pointer">
            Ngày đầy đủ <ChevronRight className="h-3 w-3" />
          </span>
        }
      />

      {includeTime && (
        <OptionRow
          label="Định dạng giờ"
          control={
            <Select value={timeFormat} onValueChange={(val) => onTimeFormatChange(val as TimeFormatType)}>
              <SelectTrigger className="h-6 w-fit border-none shadow-none text-xs text-muted-foreground p-0 gap-1 hover:text-foreground transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper" side="right" align="start" sideOffset={8} className="w-[120px]">
                <SelectItem value="12h">12 giờ</SelectItem>
                <SelectItem value="24h">24 giờ</SelectItem>
                <SelectItem value="hidden">Ẩn</SelectItem>
              </SelectContent>
            </Select>
          }
        />
      )}

      <OptionRow
        label="Múi giờ"
        control={
          <span className="text-xs text-muted-foreground flex items-center gap-1 cursor-pointer">
            GMT +7 <ChevronRight className="h-3 w-3" />
          </span>
        }
      />
    </div>
  )
}

// ─── useTaskDatePicker hook ───────────────────────────────────────────────────

function useTaskDatePicker({ startDate, dueDate, onStartDateChange, onDueDateChange }: TaskDatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(startDate)
  const [endDate, setEndDate] = React.useState<Date | undefined>(dueDate || undefined)
  const [activeField, setActiveField] = React.useState<ActiveFieldType>('start')
  const [endDateEnabled, setEndDateEnabled] = React.useState(!!dueDate)
  const [includeTime, setIncludeTime] = React.useState(false)
  const [timeFormat, setTimeFormat] = React.useState<TimeFormatType>('12h')
  const [open, setOpen] = React.useState(false)
  const didInitEndDateRef = React.useRef(false)

  React.useEffect(() => { setDate(startDate) }, [startDate])
  React.useEffect(() => {
    setEndDate(dueDate)
    if (!didInitEndDateRef.current) {
      setEndDateEnabled(!!dueDate)
      didInitEndDateRef.current = true
    }
  }, [dueDate])

  const updateStartDate = React.useCallback((next: Date | undefined) => {
    setDate(next)
    onStartDateChange?.(next)
  }, [onStartDateChange])

  const updateEndDate = React.useCallback((next: Date | undefined) => {
    setEndDate(next)
    onDueDateChange?.(next)
  }, [onDueDateChange])

  const handleDayClick = React.useCallback((day: Date) => {
    if (!endDateEnabled) {
      updateStartDate(applyTimePreserved(date, day))
      setActiveField('start')
      return
    }
    if (activeField === 'start') {
      updateStartDate(applyTimePreserved(date, day))
      if (endDate && isAfter(day, endDate)) updateEndDate(undefined)
      setActiveField('end')
    } else {
      if (date && isBefore(day, date)) {
        updateStartDate(applyTimePreserved(date, day))
        setActiveField('start')
      } else {
        updateEndDate(applyTimePreserved(endDate, day))
      }
    }
  }, [activeField, date, endDate, endDateEnabled, updateStartDate, updateEndDate])

  const handleToggleEndDate = React.useCallback((checked: boolean) => {
    setEndDateEnabled(checked)
    if (!checked) {
      updateEndDate(undefined)
      setActiveField('start')
    } else {
      if (date && !endDate) updateEndDate(date)
      setActiveField('end')
    }
  }, [date, endDate, updateEndDate])

  const handleClear = React.useCallback(() => {
    updateStartDate(undefined)
    updateEndDate(undefined)
    setEndDateEnabled(false)
    setActiveField('start')
  }, [updateStartDate, updateEndDate])

  return {
    state: { date, endDate, activeField, endDateEnabled, includeTime, timeFormat, open },
    actions: { setOpen, setActiveField, setIncludeTime, setTimeFormat, updateStartDate, updateEndDate, handleDayClick, handleToggleEndDate, handleClear },
  }
}

// ─── TaskDatePicker (main export) ────────────────────────────────────────────

export function TaskDatePicker(props: TaskDatePickerProps) {
  const { state, actions } = useTaskDatePicker(props)

  return (
    <Popover open={state.open} onOpenChange={actions.setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="h-auto w-fit justify-start p-0 m-0 font-normal border-none shadow-none ring-0 focus-visible:ring-0 bg-transparent cursor-pointer text-[12px] hover:bg-transparent"
          style={{ color: state.date ? '#141413' : '#8e8b82' }}
        >
          <TriggerButton
            date={state.date}
            endDate={state.endDate}
            endDateEnabled={state.endDateEnabled}
            includeTime={state.includeTime}
            timeFormat={state.timeFormat}
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[260px] p-0 shadow-xl overflow-visible" align="start">
        <div className="p-3 pb-2 space-y-4 bg-popover rounded-t-md relative z-20">
          <DateInputRow
            label="Ngày bắt đầu"
            date={state.date}
            setDate={actions.updateStartDate}
            includeTime={state.includeTime}
            timeFormat={state.timeFormat}
            isActive={state.activeField === 'start'}
            onActive={() => actions.setActiveField('start')}
          />
          {state.endDateEnabled && (
            <DateInputRow
              label="Ngày kết thúc"
              date={state.endDate}
              setDate={actions.updateEndDate}
              includeTime={state.includeTime}
              timeFormat={state.timeFormat}
              minDate={state.date}
              isActive={state.activeField === 'end'}
              onActive={() => actions.setActiveField('end')}
            />
          )}
        </div>

        <CalendarView
          date={state.date}
          endDate={state.endDate}
          activeField={state.activeField}
          onDayClick={actions.handleDayClick}
          isRangeMode={state.endDateEnabled}
        />

        <OptionsPanel
          endDateEnabled={state.endDateEnabled}
          includeTime={state.includeTime}
          timeFormat={state.timeFormat}
          onToggleEndDate={actions.handleToggleEndDate}
          onToggleIncludeTime={actions.setIncludeTime}
          onTimeFormatChange={actions.setTimeFormat}
        />

        <div className="border-t border-border p-2 bg-muted/30 flex justify-between items-center rounded-b-md">
          <div className="flex items-center gap-1 px-2 text-[10px] text-muted-foreground">
            <CircleHelp className="h-3 w-3" />
            <span>Trợ giúp nhắc nhở</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={actions.handleClear}
          >
            Xóa
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
