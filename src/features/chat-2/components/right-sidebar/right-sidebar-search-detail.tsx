'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useState } from 'react'
// import { SenderFilterDropdown } from './sender-filter-dropdown'
// import { DateFilterDropdown } from './date-filter-dropdown'
import { DateRange } from 'react-day-picker'
import * as React from 'react'
import { Search, ChevronDown, User, Check, X, ChevronsUpDown, CalendarIcon } from 'lucide-react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

import { format, subDays, subMonths } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Calendar } from '@/components/ui/calendar'
import { Member, SidebarItemData } from '../../schema/conversation-schema'

interface ChatSearchPanelProps {
  onClose: () => void
  activeConversation: SidebarItemData | null
}

export function RightSidebarSearchDetail({ onClose, activeConversation }: ChatSearchPanelProps) {
  const [selectedSender, setSelectedSender] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<DateRange | undefined>(undefined)

  return (
    <div className="h-full flex flex-col bg-background w-full">
      {/* Header Search Panel */}
      <div className="p-3 border-b flex flex-col gap-3">
        {/* Hàng 1: Ô tìm kiếm chính */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm tin nhắn..."
              className="pl-8 h-9 text-sm bg-muted/30 border-input focus-visible:ring-1"
              autoFocus
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 text-muted-foreground shrink-0 hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Hàng 2: Bộ lọc */}
        <div className="flex items-center gap-1">
          <span className="text-[11px] font-medium text-muted-foreground tracking-wider shrink-0">
            Lọc theo:
          </span>

          <SenderFilterDropdown
            selectedSender={selectedSender}
            onSelectSender={setSelectedSender}
            members={activeConversation?.members || []}
          />

          <DateFilterDropdown date={selectedDate} onDateSelect={setSelectedDate} />
        </div>
      </div>

      {/* Search Content */}
      <ScrollArea className="flex-1">
        <div className="flex flex-col items-center justify-center h-full p-8 text-center text-muted-foreground/60 min-h-[300px]">
          <Search className="h-10 w-10 mb-3 opacity-20" />
          <p className="text-sm">
            {selectedSender || selectedDate
              ? 'Đang lọc kết quả...'
              : 'Nhập từ khóa để bắt đầu tìm.'}
          </p>
        </div>
      </ScrollArea>
    </div>
  )
}

interface SenderFilterDropdownProps {
  selectedSender: string | null
  onSelectSender: (name: string | null) => void
  members?: Member[] // Danh sách thành viên từ activeConversation
}

export function SenderFilterDropdown({
  selectedSender,
  onSelectSender,
  members = [],
}: SenderFilterDropdownProps) {
  const [open, setOpen] = React.useState(false)

  const handleSelect = (currentValue: string) => {
    const newValue = currentValue === selectedSender ? null : currentValue
    onSelectSender(newValue)
    setOpen(false)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onSelectSender(null)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'h-7 w-[120px] px-2.5 text-xs font-normal border border-transparent gap-1.5 rounded-md justify-between transition-all',
            'bg-muted hover:bg-muted/80 text-muted-foreground',
            selectedSender &&
              'bg-secondary text-foreground font-medium border-border/50 hover:bg-secondary/80',
          )}
        >
          <div className="flex items-center gap-1.5 overflow-hidden">
            <User
              className={cn('h-3.5 w-3.5 shrink-0', selectedSender ? 'opacity-100' : 'opacity-70')}
            />
            <span className="truncate max-w-[80px]">{selectedSender || 'Người gửi'}</span>
          </div>

          {selectedSender ? (
            <div
              role="button"
              onClick={handleClear}
              className="ml-0.5 rounded-full bg-foreground/10 p-0.5 text-foreground hover:bg-foreground/20 transition-colors shrink-0"
            >
              <X className="h-2.5 w-2.5" />
            </div>
          ) : (
            <ChevronsUpDown className="h-3 w-3 shrink-0 opacity-40" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Tìm kiếm..." className="h-9" />
          <CommandList>
            <CommandEmpty>Không tìm thấy kết quả</CommandEmpty>
            <CommandGroup>
              {members.length > 0 ? (
                members.map((sender) => (
                  <CommandItem
                    key={sender.id}
                    value={sender.name}
                    onSelect={handleSelect}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={sender.avatar} alt={sender.name} />
                      <AvatarFallback className="text-[9px]">
                        {sender.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm truncate flex-1">{sender.name}</span>
                    <Check
                      className={cn(
                        'h-3.5 w-3.5 shrink-0',
                        selectedSender === sender.name ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                  </CommandItem>
                ))
              ) : (
                <CommandEmpty>Không có thành viên</CommandEmpty>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

interface DateFilterDropdownProps {
  date?: DateRange
  onDateSelect: (date: DateRange | undefined) => void
}

const PRESETS = [
  { label: '7 ngày trước', days: 7, type: 'days' as const },
  { label: '30 ngày trước', days: 30, type: 'days' as const },
  { label: '3 tháng trước', days: 3, type: 'months' as const },
]

export function DateFilterDropdown({ date, onDateSelect }: DateFilterDropdownProps) {
  const [tempDate, setTempDate] = React.useState<DateRange | undefined>(date)
  const [open, setOpen] = React.useState(false)
  const [showCalendar, setShowCalendar] = React.useState(false)

  React.useEffect(() => {
    if (open) {
      setTempDate(date)
      setShowCalendar(false)
    }
  }, [open, date])

  const handlePresetSelect = (days: number, type: 'days' | 'months' = 'days') => {
    const to = new Date()
    const from = type === 'days' ? subDays(to, days) : subMonths(to, days)
    setTempDate({ from, to })
    setShowCalendar(true)
  }

  const handleConfirm = () => {
    onDateSelect(tempDate)
    setOpen(false)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDateSelect(undefined)
    setTempDate(undefined)
    setOpen(false)
  }

  const renderTriggerText = () => {
    if (date?.from) {
      return (
        <>
          Từ {format(date.from, 'dd/MM/yyyy')}
          {date.to && ` - ${format(date.to, 'dd/MM/yyyy')}`}
        </>
      )
    }
    return 'Ngày gửi'
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'h-7 w-[120px] px-2.5 text-xs font-normal border border-transparent gap-1.5 rounded-md justify-between transition-all',
            'bg-muted hover:bg-muted/80 text-muted-foreground',
            date &&
              'bg-secondary text-foreground font-medium border-border/50 hover:bg-secondary/80',
          )}
        >
          <div className="flex items-center gap-1.5 overflow-hidden">
            <CalendarIcon
              className={cn('h-3.5 w-3.5 shrink-0', date ? 'opacity-100' : 'opacity-70')}
            />
            <span className="truncate max-w-[90px]">{renderTriggerText()}</span>
          </div>

          {date ? (
            <div
              role="button"
              onClick={handleClear}
              className="ml-0.5 rounded-full bg-foreground/10 p-0.5 text-foreground hover:bg-foreground/20 transition-colors shrink-0"
            >
              <X className="h-2.5 w-2.5" />
            </div>
          ) : (
            <ChevronsUpDown className="h-3 w-3 shrink-0 opacity-40" />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        <div className="w-[320px] bg-background rounded-md shadow-sm">
          {/* Gợi ý thời gian với Command */}
          <div className="border-b">
            <Command>
              <CommandList>
                <CommandGroup heading="Gợi ý thời gian">
                  {PRESETS.map((preset) => (
                    <CommandItem
                      key={preset.label}
                      onSelect={() => handlePresetSelect(preset.days, preset.type)}
                      className="cursor-pointer"
                    >
                      {preset.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </div>

          {/* Input chọn ngày */}
          <div className="p-3">
            <div className="text-sm font-medium mb-3">Chọn khoảng thời gian</div>

            <div className="flex items-center gap-2">
              <div
                onClick={() => setShowCalendar(true)}
                className={cn(
                  'flex-1 h-9 rounded-md border bg-background px-3 py-2 text-sm shadow-sm flex items-center justify-between cursor-pointer transition-all',
                  showCalendar
                    ? 'border-foreground ring-1 ring-foreground'
                    : 'border-input hover:border-foreground/50',
                )}
              >
                <span className={!tempDate?.from ? 'text-muted-foreground' : ''}>
                  {tempDate?.from ? format(tempDate.from, 'dd/MM/yyyy') : 'Từ ngày'}
                </span>
                <CalendarIcon className="h-3.5 w-3.5 opacity-50" />
              </div>

              <div
                onClick={() => setShowCalendar(true)}
                className={cn(
                  'flex-1 h-9 rounded-md border bg-background px-3 py-2 text-sm shadow-sm flex items-center justify-between cursor-pointer transition-all',
                  showCalendar
                    ? 'border-foreground ring-1 ring-foreground'
                    : 'border-input hover:border-foreground/50',
                )}
              >
                <span className={!tempDate?.to ? 'text-muted-foreground' : ''}>
                  {tempDate?.to ? format(tempDate.to, 'dd/MM/yyyy') : 'Đến ngày'}
                </span>
                <CalendarIcon className="h-3.5 w-3.5 opacity-50" />
              </div>
            </div>

            {/* Lịch */}
            {showCalendar && (
              <div className="mt-4 border rounded-md animate-in fade-in slide-in-from-top-2 duration-200">
                <Calendar
                  mode="range"
                  defaultMonth={tempDate?.from}
                  selected={tempDate}
                  onSelect={setTempDate}
                  numberOfMonths={1}
                  disabled={(date) => date > new Date()}
                  locale={vi}
                  className="rounded-md border-0"
                />
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 p-3 border-t bg-muted/10">
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button
              size="sm"
              onClick={handleConfirm}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Xác nhận
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
