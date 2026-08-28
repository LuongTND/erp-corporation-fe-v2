import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { createRecruitmentRequestSchema } from '../../schemas/recruitment-request.schema'
import type { CreateRecruitmentRequestFormValues } from '../../schemas/recruitment-request.schema'
import type { CreateRecruitmentRequestPayload, RecruitmentContext } from '../../types/recruitment.types'

interface JobPositionOption {
  id: string
  name: string
}

interface StoreOption {
  id: string
  name: string
}

interface DepartmentOption {
  id: string
  name: string
}

interface CreateRequestDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateRecruitmentRequestPayload) => void
  isPending: boolean
  jobPositions: JobPositionOption[]
  stores: StoreOption[]
  departments: DepartmentOption[]
  defaultContext?: RecruitmentContext
}

export function CreateRequestDialog({
  open,
  onOpenChange,
  onSubmit,
  isPending,
  jobPositions,
  stores,
  departments,
  defaultContext = 'Store',
}: CreateRequestDialogProps) {
  const form = useForm<CreateRecruitmentRequestFormValues>({
    resolver: zodResolver(createRecruitmentRequestSchema),
    defaultValues: {
      context: defaultContext,
      jobPositionId: '',
      quantity: 1,
      reason: '',
      storeId: '',
      departmentId: '',
    },
  })

  const context = form.watch('context')

  function handleSubmit(values: CreateRecruitmentRequestFormValues) {
    const payload: CreateRecruitmentRequestPayload = {
      context: values.context,
      jobPositionId: values.jobPositionId,
      quantity: values.quantity,
      reason: values.reason || undefined,
      storeId: values.context === 'Store' ? values.storeId || undefined : undefined,
      departmentId: values.context === 'Production' ? values.departmentId || undefined : undefined,
    }
    onSubmit(payload)
  }

  function handleOpenChange(open: boolean) {
    if (!open) form.reset()
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-[480px] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-bottom-4 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-bottom-2 animation-duration-250"
      >
        <DialogHeader>
          <DialogTitle>Tạo phiếu đề xuất tuyển dụng</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="context"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Khối</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="cursor-pointer">
                        <SelectValue placeholder="Chọn khối" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent
                      align="start"
                      sideOffset={4}
                      className="data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 animation-duration-200"
                    >
                      <SelectItem value="Store">Cửa hàng</SelectItem>
                      <SelectItem value="Production">Sản xuất</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {context === 'Store' && (
              <FormField
                control={form.control}
                name="storeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cửa hàng</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="cursor-pointer">
                          <SelectValue placeholder="Chọn cửa hàng" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent
                        align="start"
                        sideOffset={4}
                        className="data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 animation-duration-200"
                      >
                        {stores.map((store) => (
                          <SelectItem key={store.id} value={store.id}>
                            {store.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {context === 'Production' && (
              <FormField
                control={form.control}
                name="departmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phòng ban</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="cursor-pointer">
                          <SelectValue placeholder="Chọn phòng ban" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent
                        align="start"
                        sideOffset={4}
                        className="data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 animation-duration-200"
                      >
                        {departments.map((department) => (
                          <SelectItem key={department.id} value={department.id}>
                            {department.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="jobPositionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vị trí tuyển dụng</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="cursor-pointer">
                        <SelectValue placeholder="Chọn vị trí" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent
                      align="start"
                      sideOffset={4}
                      className="data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 animation-duration-200"
                    >
                      {jobPositions.map((position) => (
                        <SelectItem key={position.id} value={position.id}>
                          {position.name}
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
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số lượng cần tuyển</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} max={100} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lý do tuyển dụng</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nhập lý do tuyển dụng..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isPending}
                className="cursor-pointer"
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isPending} className="cursor-pointer">
                {isPending ? 'Đang tạo...' : 'Tạo phiếu'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
