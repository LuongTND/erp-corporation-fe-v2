import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import {
  createInterviewRuleConfigSchema,
  type CreateInterviewRuleConfigFormData,
} from '../../schemas/interview-rule-config.schema'
import {
  INTERVIEW_RULE_CONTEXT_LABELS,
  INTERVIEW_RULE_LOCATION_LABELS,
  type InterviewRuleConfigResponse,
} from '../../types/admin.types'

interface Props {
  open: boolean
  onOpenChange: (v: boolean) => void
  editing?: InterviewRuleConfigResponse | null
  onSubmit: (data: CreateInterviewRuleConfigFormData) => void
  isPending: boolean
}

export function InterviewRuleConfigDialog({ open, onOpenChange, editing, onSubmit, isPending }: Props) {
  const form = useForm<CreateInterviewRuleConfigFormData>({
    resolver: zodResolver(createInterviewRuleConfigSchema),
    defaultValues: {
      name: '',
      context: 'Office',
      interviewerRoleKey: '',
      location: 'AtOffice',
      priority: 1,
      isActive: true,
    },
  })

  useEffect(() => {
    if (editing) {
      form.reset({
        name: editing.name,
        context: editing.context,
        regionId: editing.regionId ?? undefined,
        departmentId: editing.departmentId ?? undefined,
        interviewerRoleKey: editing.interviewerRoleKey,
        location: editing.location,
        schedulerRoleKey: editing.schedulerRoleKey ?? undefined,
        notifyRoleKey: editing.notifyRoleKey ?? undefined,
        priority: editing.priority,
        isActive: editing.isActive,
      })
    } else {
      form.reset({
        name: '',
        context: 'Office',
        interviewerRoleKey: '',
        location: 'AtOffice',
        priority: 1,
        isActive: true,
      })
    }
  }, [editing, open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-lg data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-bottom-4 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 [animation-duration:250ms]"
      >
        <DialogHeader>
          <DialogTitle>{editing ? 'Sửa rule phỏng vấn' : 'Tạo rule phỏng vấn'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên rule</FormLabel>
                  <FormControl><Input placeholder="Nhập tên rule..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="context"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngữ cảnh</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                      </FormControl>
                      <SelectContent align="start" sideOffset={4}>
                        {Object.entries(INTERVIEW_RULE_CONTEXT_LABELS).map(([k, v]) => (
                          <SelectItem key={k} value={k}>{v}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Địa điểm</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                      </FormControl>
                      <SelectContent align="start" sideOffset={4}>
                        {Object.entries(INTERVIEW_RULE_LOCATION_LABELS).map(([k, v]) => (
                          <SelectItem key={k} value={k}>{v}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="interviewerRoleKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role người phỏng vấn</FormLabel>
                  <FormControl><Input placeholder="vd: store_manager" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="schedulerRoleKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role lập lịch</FormLabel>
                    <FormControl><Input placeholder="tuỳ chọn" {...field} value={field.value ?? ''} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notifyRoleKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role nhận thông báo</FormLabel>
                    <FormControl><Input placeholder="tuỳ chọn" {...field} value={field.value ?? ''} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="regionId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Region ID</FormLabel>
                    <FormControl><Input placeholder="tuỳ chọn" {...field} value={field.value ?? ''} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="departmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department ID</FormLabel>
                    <FormControl><Input placeholder="tuỳ chọn" {...field} value={field.value ?? ''} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 items-center">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Độ ưu tiên</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        {...field}
                        onChange={e => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kích hoạt</FormLabel>
                    <div className="flex items-center gap-2 pt-1">
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <Label className="text-sm text-muted-foreground">
                        {field.value ? 'Đang hoạt động' : 'Tắt'}
                      </Label>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Huỷ
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Đang lưu...' : editing ? 'Cập nhật' : 'Tạo mới'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
