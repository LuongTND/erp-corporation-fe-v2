import { CircleHelp } from 'lucide-react'
import { cn } from '@/lib/utils'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { DateInputRow } from './date-picker/DateInputRow'
import { CalendarView } from './date-picker/CalendarView'
import { OptionsPanel } from './date-picker/OptionsPanel'
import { TriggerButton } from './date-picker/TriggerButton'

import { useTaskDatePicker } from '@/features/task/hooks/use-task-date-picker'
import type { TaskDatePickerProps } from '@/features/task/types/date-picker.types'

export function TaskDatePicker(props: TaskDatePickerProps) {
  const { state, actions } = useTaskDatePicker(props)

  return (
    <Popover open={state.open} onOpenChange={actions.setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            'h-8 w-fit justify-start p-1 px-2 text-left font-normal -ml-2 transition-colors hover:bg-accent hover:text-accent-foreground',
            !state.date ? 'text-muted-foreground' : 'text-foreground',
          )}
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
            label="Start date"
            date={state.date}
            setDate={actions.updateStartDate}
            includeTime={state.includeTime}
            timeFormat={state.timeFormat}
            isActive={state.activeField === 'start'}
            onActive={() => actions.setActiveField('start')}
          />
          {state.endDateEnabled && (
            <DateInputRow
              label="End date"
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
            <span>Reminders help</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={actions.handleClear}
          >
            Clear
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
