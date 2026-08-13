import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Toggle } from '@/components/ui/toggle'
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
            <ul className="space-y-1.5">
              <li className="grid grid-cols-[52px_1fr_auto] items-center gap-3 px-3 pb-1" aria-hidden>
                <Label className="text-xs text-muted-foreground">Ngày</Label>
                <div className="flex items-center gap-2">
                  <Label className="flex-1 text-center text-xs text-muted-foreground">Mở cửa</Label>
                  <span className="w-4" />
                  <Label className="flex-1 text-center text-xs text-muted-foreground">Đóng cửa</Label>
                </div>
                <Label className="text-xs text-muted-foreground">Nghỉ</Label>
              </li>

              {rows.map((row, i) => (
                <li
                  key={i}
                  className={cn(
                    'grid grid-cols-[52px_1fr_auto] items-center gap-3 rounded-lg border px-3 py-2 transition-colors',
                    row.isClosed ? 'border-destructive/20 bg-destructive/5' : 'border-transparent bg-muted/30',
                  )}
                >
                  <Label className={cn('text-sm font-medium', row.isClosed && 'text-muted-foreground line-through')}>
                    {DAYS[row.dayOfWeek]}
                  </Label>

                  <div className="flex min-w-0 items-center gap-2">
                    {row.isClosed ? (
                      <Badge variant="destructive" className="text-xs">Nghỉ</Badge>
                    ) : (
                      <>
                        <Input
                          type="time"
                          value={row.openTime}
                          onChange={e => setRow(i, { openTime: e.target.value })}
                          className="h-8 min-w-0 flex-1 px-2 text-xs tabular-nums"
                          aria-label={`Giờ mở cửa ${DAYS[row.dayOfWeek]}`}
                        />
                        <span className="shrink-0 text-xs text-muted-foreground" aria-hidden>→</span>
                        <Input
                          type="time"
                          value={row.closeTime}
                          onChange={e => setRow(i, { closeTime: e.target.value })}
                          className="h-8 min-w-0 flex-1 px-2 text-xs tabular-nums"
                          aria-label={`Giờ đóng cửa ${DAYS[row.dayOfWeek]}`}
                        />
                      </>
                    )}
                  </div>

                  <Toggle
                    pressed={row.isClosed}
                    onPressedChange={v => setRow(i, { isClosed: v })}
                    size="sm"
                    variant="outline"
                    aria-label={`${DAYS[row.dayOfWeek]} nghỉ`}
                    className={cn(
                      'text-xs',
                      row.isClosed && 'border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive/20 data-[state=on]:bg-destructive/10 data-[state=on]:text-destructive',
                    )}
                  >
                    Nghỉ
                  </Toggle>
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
