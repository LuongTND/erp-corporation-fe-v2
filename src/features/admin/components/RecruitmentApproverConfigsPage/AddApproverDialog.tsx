import { useState } from 'react'
import { ChevronsUpDown, Check } from 'lucide-react'
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Popover, PopoverContent, PopoverTrigger,
} from '@/components/ui/popover'
import {
  Command, CommandEmpty, CommandInput, CommandItem, CommandList,
} from '@/components/ui/command'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type {
  DepartmentResponse, SetRecruitmentApproverPayload, UserSummaryResponse,
} from '../../types/admin.types'

interface AddApproverDialogProps {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly employees: UserSummaryResponse[]
  readonly departments: DepartmentResponse[]
  readonly isPending: boolean
  readonly onSave: (payload: SetRecruitmentApproverPayload) => void
}

export function AddApproverDialog({
  open,
  onOpenChange,
  employees,
  departments,
  isPending,
  onSave,
}: AddApproverDialogProps) {
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [approverId, setApproverId] = useState('')
  const [departmentId, setDepartmentId] = useState('__global__')
  const [note, setNote] = useState('')

  const selectedEmployee = employees.find((e) => e.id === approverId)

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setApproverId('')
      setDepartmentId('__global__')
      setNote('')
    }
    onOpenChange(nextOpen)
  }

  const handleSave = () => {
    if (!approverId) return
    onSave({
      approverId,
      departmentId: departmentId === '__global__' ? undefined : departmentId,
      note: note || undefined,
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Thêm người duyệt tuyển dụng</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Người duyệt *</Label>
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={popoverOpen}
                  className="w-full h-9 justify-between font-normal"
                >
                  {selectedEmployee
                    ? `${selectedEmployee.fullName}${selectedEmployee.employeeCode ? ` (${selectedEmployee.employeeCode})` : ''}`
                    : 'Tìm nhân viên...'}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Tìm nhân viên..." />
                  <CommandList>
                    <CommandEmpty>Không tìm thấy nhân viên</CommandEmpty>
                    {employees.map((employee) => (
                      <CommandItem
                        key={employee.id}
                        value={`${employee.fullName} ${employee.employeeCode}`}
                        onSelect={() => {
                          setApproverId(employee.id)
                          setPopoverOpen(false)
                        }}
                      >
                        <Check className={cn('mr-2 h-4 w-4', approverId === employee.id ? 'opacity-100' : 'opacity-0')} />
                        <span>{employee.fullName}</span>
                        {employee.employeeCode && (
                          <span className="ml-1 text-xs text-muted-foreground">({employee.employeeCode})</span>
                        )}
                      </CommandItem>
                    ))}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Phòng ban áp dụng</Label>
            <Select value={departmentId} onValueChange={setDepartmentId}>
              <SelectTrigger className="h-9 cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="start" sideOffset={4}>
                <SelectItem value="__global__">Toàn công ty</SelectItem>
                {departments.map((department) => (
                  <SelectItem key={department.id} value={department.id}>
                    {department.departmentName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Ghi chú</Label>
            <Input
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Tùy chọn..."
              className="h-9"
            />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOpenChange(false)}
            disabled={isPending}
            className="cursor-pointer"
          >
            Hủy
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!approverId || isPending}
            className="cursor-pointer"
          >
            {isPending ? 'Đang lưu…' : 'Lưu'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
