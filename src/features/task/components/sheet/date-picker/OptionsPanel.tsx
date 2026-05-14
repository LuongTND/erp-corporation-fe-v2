import { ChevronRight } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { TimeFormatType } from '@/features/task/types/date-picker.types'

function OptionRow({ label, control }: { label: string; control: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-3 py-1.5 hover:bg-accent/50 cursor-pointer group transition-colors">
      <span className="text-sm text-foreground/80 group-hover:text-foreground">{label}</span>
      {control}
    </div>
  )
}

interface OptionsPanelProps {
  endDateEnabled: boolean
  includeTime: boolean
  timeFormat: TimeFormatType
  onToggleEndDate: (checked: boolean) => void
  onToggleIncludeTime: (checked: boolean) => void
  onTimeFormatChange: (value: TimeFormatType) => void
}

export function OptionsPanel({
  endDateEnabled,
  includeTime,
  timeFormat,
  onToggleEndDate,
  onToggleIncludeTime,
  onTimeFormatChange,
}: OptionsPanelProps) {
  return (
    <div className="py-2 bg-popover relative z-10">
      <OptionRow
        label="End date"
        control={
          <Switch
            checked={endDateEnabled}
            onCheckedChange={onToggleEndDate}
            className="scale-75"
          />
        }
      />
      <OptionRow
        label="Include time"
        control={
          <Switch
            checked={includeTime}
            onCheckedChange={onToggleIncludeTime}
            className="scale-75"
          />
        }
      />
      <OptionRow
        label="Date format"
        control={
          <span className="text-xs text-muted-foreground flex items-center gap-1 cursor-pointer">
            Full date <ChevronRight className="h-3 w-3" />
          </span>
        }
      />

      {includeTime && (
        <OptionRow
          label="Time format"
          control={
            <Select
              value={timeFormat}
              onValueChange={(val) => onTimeFormatChange(val as TimeFormatType)}
            >
              <SelectTrigger className="h-6 w-fit border-none shadow-none text-xs text-muted-foreground p-0 gap-1 hover:text-foreground transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent
                position="popper"
                side="right"
                align="start"
                sideOffset={8}
                className="w-[120px]"
              >
                <SelectItem value="12h">12 hour</SelectItem>
                <SelectItem value="24h">24 hour</SelectItem>
                <SelectItem value="hidden">Hidden</SelectItem>
              </SelectContent>
            </Select>
          }
        />
      )}

      <OptionRow
        label="Timezone"
        control={
          <span className="text-xs text-muted-foreground flex items-center gap-1 cursor-pointer">
            GMT +7 <ChevronRight className="h-3 w-3" />
          </span>
        }
      />
    </div>
  )
}
