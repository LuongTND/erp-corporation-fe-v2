import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { MapPin } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { RegionHoursResponse } from '../../types/admin.types'

const DAYS = ['CN', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7']

const DAY_NAME_TO_INDEX: Record<string, number> = {
  Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6,
}

function toDayIndex(dayOfWeek: number | string): number {
  return typeof dayOfWeek === 'number' ? dayOfWeek : (DAY_NAME_TO_INDEX[dayOfWeek] ?? 0)
}

function toTimeInput(t: string | undefined, fallback: string): string {
  return t ? t.substring(0, 5) : fallback
}

interface DayRow { dayOfWeek: number; openTime: string; closeTime: string; isClosed: boolean }

function initRows(data: RegionHoursResponse[]): DayRow[] {
  const map = Object.fromEntries(data.map(h => [toDayIndex(h.dayOfWeek), h]))
  return Array.from({ length: 7 }, (_, i) => ({
    dayOfWeek: i,
    openTime: toTimeInput(map[i]?.openTime, '08:00'),
    closeTime: toTimeInput(map[i]?.closeTime, '22:00'),
    isClosed: map[i]?.isClosed ?? false,
  }))
}

export interface RegionHoursItem {
  dayOfWeek: number
  openTime: string
  closeTime: string
  isClosed: boolean
}

interface Props {
  open: boolean
  regionName: string
  regionHours: RegionHoursResponse[]
  isLoading: boolean
  isSaving: boolean
  onOpenChange: (open: boolean) => void
  onSave: (hours: RegionHoursItem[]) => void
}

export function RegionHoursDialog({ open, regionName, regionHours, isLoading, isSaving, onOpenChange, onSave }: Props) {
  const [rows, setRows] = useState<DayRow[]>(() => initRows(regionHours))

  useEffect(() => { setRows(initRows(regionHours)) }, [regionHours])

  const setRow = (idx: number, patch: Partial<DayRow>) =>
    setRows(prev => prev.map((r, i) => i === idx ? { ...r, ...patch } : r))

  const handleSave = () => {
    const origMap = Object.fromEntries(regionHours.map(h => [toDayIndex(h.dayOfWeek), h]))

    const changed = rows.filter(r => {
      const orig = origMap[r.dayOfWeek]
      if (!orig) return true
      return orig.isClosed !== r.isClosed ||
        toTimeInput(orig.openTime, '08:00') !== r.openTime ||
        toTimeInput(orig.closeTime, '22:00') !== r.closeTime
    })

    if (changed.length === 0) { onOpenChange(false); return }

    onSave(changed.map(r => ({
      dayOfWeek: r.dayOfWeek,
      openTime: r.openTime + ':00',
      closeTime: r.closeTime + ':00',
      isClosed: r.isClosed,
    })))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 sm:max-w-md data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-bottom-4 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-bottom-2 animation-duration-250">
        <DialogHeader className="flex-row items-center gap-3 border-b px-5 py-4">
          <figure className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-500/10">
            <MapPin className="h-4 w-4 text-violet-500" />
          </figure>
          <hgroup>
            <DialogTitle className="text-base">Giờ mở cửa mặc định</DialogTitle>
            <p className="mt-0.5 text-xs text-muted-foreground">{regionName}</p>
          </hgroup>
        </DialogHeader>

        <section className="max-h-[60vh] overflow-y-auto px-4 py-3">
          {isLoading ? (
            <ul className="space-y-1.5">
              {Array.from({ length: 7 }).map((_, i) => (
                <li key={i} className="flex items-center gap-3 rounded-lg border border-transparent px-3 py-2">
                  <Skeleton className="h-4 w-10" />
                  <Skeleton className="h-8 flex-1" />
                  <Skeleton className="h-5 w-9 rounded-full" />
                </li>
              ))}
            </ul>
          ) : (
            <ul className="space-y-1">
              {rows.map((row, i) => (
                <li
                  key={i}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all',
                    row.isClosed ? 'opacity-50' : 'bg-muted/30',
                  )}
                >
                  <Switch
                    checked={!row.isClosed}
                    onCheckedChange={v => setRow(i, { isClosed: !v })}
                    aria-label={`${DAYS[row.dayOfWeek]} ${row.isClosed ? 'đóng cửa' : 'mở cửa'}`}
                  />

                  <Label className="w-10 shrink-0 text-sm font-medium">
                    {DAYS[row.dayOfWeek]}
                  </Label>

                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    <Input
                      type="time"
                      value={row.openTime}
                      onChange={e => setRow(i, { openTime: e.target.value })}
                      disabled={row.isClosed}
                      className="h-8 min-w-0 flex-1 px-2 text-xs tabular-nums"
                      aria-label={`Giờ mở cửa ${DAYS[row.dayOfWeek]}`}
                    />
                    <span className="shrink-0 text-xs text-muted-foreground" aria-hidden>–</span>
                    <Input
                      type="time"
                      value={row.closeTime}
                      onChange={e => setRow(i, { closeTime: e.target.value })}
                      disabled={row.isClosed}
                      className="h-8 min-w-0 flex-1 px-2 text-xs tabular-nums"
                      aria-label={`Giờ đóng cửa ${DAYS[row.dayOfWeek]}`}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <DialogFooter className="mx-0 mb-0 rounded-b-xl border-t bg-muted/30 px-5 py-3">
          <Button type="button" variant="ghost" size="sm" onClick={() => onOpenChange(false)}>Hủy</Button>
          <Button size="sm" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Đang lưu...' : 'Lưu giờ mặc định'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
