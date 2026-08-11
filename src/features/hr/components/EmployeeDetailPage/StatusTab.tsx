import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, Clock } from 'lucide-react'
import { fmtDateTime } from '@/lib/date'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form'
import { updateUserStatusSchema, type UpdateUserStatusFormValues } from '../../schemas/update-user-status.schema'
import { USER_STATUS, USER_STATUS_LABEL, type UserStatus, type UserStatusHistoryItem } from '../../types/user-status.types'

const STATUS_VARIANT: Record<UserStatus, string> = {
  Active:        'border-green-500/30  bg-green-500/10  text-green-700  dark:text-green-400',
  Official:      'border-green-500/30  bg-green-500/10  text-green-700  dark:text-green-400',
  Probation:     'border-blue-500/30   bg-blue-500/10   text-blue-700   dark:text-blue-400',
  Apprentice:    'border-blue-500/30   bg-blue-500/10   text-blue-700   dark:text-blue-400',
  Resigned:      'border-border        bg-muted/40      text-muted-foreground',
  Terminated:    'border-red-500/30    bg-red-500/10    text-red-700    dark:text-red-400',
  Suspended:     'border-amber-500/30  bg-amber-500/10  text-amber-700  dark:text-amber-400',
  MaternityLeave:'border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-400',
}

interface StatusTabProps {
  currentStatus: UserStatus
  history: UserStatusHistoryItem[] | undefined
  isLoadingHistory: boolean
  onUpdateStatus: (values: UpdateUserStatusFormValues, callbacks: { onSuccess: () => void }) => void
  isPendingUpdate: boolean
}

export function StatusTab({ currentStatus, history, isLoadingHistory, onUpdateStatus, isPendingUpdate }: StatusTabProps) {
  const [formOpen, setFormOpen] = useState(false)

  const form = useForm<UpdateUserStatusFormValues>({
    resolver: zodResolver(updateUserStatusSchema),
    defaultValues: { newStatus: currentStatus, note: '' },
  })

  function onSubmit(values: UpdateUserStatusFormValues) {
    onUpdateStatus(values, {
      onSuccess: () => {
        setFormOpen(false)
        form.reset()
      },
    })
  }

  return (
    <div className="space-y-4">

      {/* Current status */}
      <Card className="shadow-none">
        <CardHeader className="flex flex-row items-center justify-between pb-3 pt-4">
          <CardTitle className="text-sm font-medium text-muted-foreground">Trạng thái hiện tại</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={() => setFormOpen(v => !v)}
          >
            {formOpen ? 'Hủy' : 'Thay đổi'}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4 pb-4">
          <Badge
            variant="outline"
            className={`text-xs font-normal ${STATUS_VARIANT[currentStatus]}`}
          >
            {USER_STATUS_LABEL[currentStatus]}
          </Badge>

          {formOpen && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-200">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 rounded-lg border border-border bg-muted/30 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Thay đổi trạng thái</p>
                <FormField
                  control={form.control}
                  name="newStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-muted-foreground">Trạng thái mới</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-8 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(USER_STATUS).map(status => (
                            <SelectItem key={status} value={status} className="text-sm">
                              {USER_STATUS_LABEL[status]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-muted-foreground">Ghi chú (tùy chọn)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Lý do thay đổi..."
                          className="min-h-[72px] resize-none text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2 pt-1">
                  <Button type="button" variant="ghost" size="sm" onClick={() => setFormOpen(false)}>Hủy</Button>
                  <Button type="submit" size="sm" disabled={isPendingUpdate}>
                    {isPendingUpdate ? 'Đang lưu...' : 'Lưu'}
                  </Button>
                </div>
              </form>
            </Form>
            </div>
          )}
        </CardContent>
      </Card>

      {/* History */}
      <Card className="shadow-none">
        <CardHeader className="flex flex-row items-center gap-2 pb-3 pt-4">
          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
          <CardTitle className="text-sm font-medium text-muted-foreground">Lịch sử trạng thái</CardTitle>
        </CardHeader>
        <CardContent className="pb-0 pt-0">
          {isLoadingHistory ? (
            <div className="space-y-3 pb-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : !history?.length ? (
            <p className="pb-4 text-sm text-muted-foreground">Chưa có lịch sử thay đổi.</p>
          ) : (
            <div className="divide-y divide-border">
              {history.map((item, index) => (
                <div key={index} className="flex items-center justify-between gap-4 py-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`shrink-0 text-xs font-normal ${STATUS_VARIANT[item.oldStatus]}`}
                    >
                      {USER_STATUS_LABEL[item.oldStatus]}
                    </Badge>
                    <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground/50" />
                    <Badge
                      variant="outline"
                      className={`shrink-0 text-xs font-normal ${STATUS_VARIANT[item.newStatus]}`}
                    >
                      {USER_STATUS_LABEL[item.newStatus]}
                    </Badge>
                    {item.note && (
                      <span className="truncate text-xs text-muted-foreground">· {item.note}</span>
                    )}
                  </div>
                  <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                    {fmtDateTime(item.changedAt)}
                  </span>
                </div>
              ))}
            </div>
          )}
          <Separator />
        </CardContent>
      </Card>

    </div>
  )
}
