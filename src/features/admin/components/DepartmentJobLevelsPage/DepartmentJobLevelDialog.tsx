import type { UseFormReturn } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { DepartmentJobLevelFormValues } from '../../schemas/admin.schemas'
import type { DepartmentResponse, JobLevelResponse } from '../../types/admin.types'

interface DepartmentJobLevelDialogProps {
  readonly open: boolean
  readonly isEdit: boolean
  readonly form: UseFormReturn<DepartmentJobLevelFormValues>
  readonly departments: DepartmentResponse[]
  readonly jobLevels: JobLevelResponse[]
  readonly onSubmit: (values: DepartmentJobLevelFormValues) => void
  readonly onOpenChange: (open: boolean) => void
  readonly isPending: boolean
}

export function DepartmentJobLevelDialog({
  open, isEdit, form, departments, jobLevels, onSubmit, onOpenChange, isPending,
}: DepartmentJobLevelDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Chỉnh sửa vị trí công việc' : 'Tạo vị trí công việc'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <FormField
              control={form.control}
              name="departmentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phòng ban <span aria-hidden="true" className="text-destructive">*</span></FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Chọn phòng ban" /></SelectTrigger>
                    </FormControl>
                    <SelectContent align="start" sideOffset={4}>
                      {departments.map(d => (
                        <SelectItem key={d.id} value={d.id}>{d.departmentName}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="jobLevelId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cấp bậc <span aria-hidden="true" className="text-destructive">*</span></FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Chọn cấp bậc" /></SelectTrigger>
                    </FormControl>
                    <SelectContent align="start" sideOffset={4}>
                      {jobLevels.map(l => (
                        <SelectItem key={l.id} value={l.id}>{l.levelName}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Đang lưu...' : isEdit ? 'Lưu thay đổi' : 'Tạo mới'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
