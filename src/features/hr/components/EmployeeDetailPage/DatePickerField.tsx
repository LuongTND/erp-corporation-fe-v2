import { useState } from 'react'
import { CalendarIcon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { fmtDate, toVnDateString, parseVnDate } from '@/lib/date'

interface DatePickerFieldProps {
  readonly value: string
  readonly onChange: (v: string) => void
  readonly fromYear?: number
  readonly toYear?: number
}

export function DatePickerField({ value, onChange, fromYear = 1950, toYear = new Date().getFullYear() + 5 }: DatePickerFieldProps) {
  const [open, setOpen] = useState(false)
  const selected = value ? parseVnDate(value) : undefined

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={`flex h-9 w-full items-center gap-2 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${!value ? 'text-muted-foreground' : 'text-foreground'}`}
        >
          <CalendarIcon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          {value ? fmtDate(value) : 'Chọn ngày'}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(date) => {
            onChange(date ? toVnDateString(date) : '')
            setOpen(false)
          }}
          captionLayout="dropdown"
          startMonth={new Date(fromYear, 0)}
          endMonth={new Date(toYear, 11)}
          defaultMonth={selected ?? new Date()}
        />
      </PopoverContent>
    </Popover>
  )
}
