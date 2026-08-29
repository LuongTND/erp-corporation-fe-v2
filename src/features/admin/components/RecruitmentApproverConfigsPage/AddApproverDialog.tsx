import { useState, useMemo, type ChangeEvent } from 'react'
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput,
  ComboboxItem, ComboboxList, useComboboxAnchor,
} from '@/components/ui/combobox'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
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
  const [approverId, setApproverId] = useState('')
  const [employeeSearch, setEmployeeSearch] = useState('')
  const [departmentId, setDepartmentId] = useState('__global__')
  const [note, setNote] = useState('')

  const anchor = useComboboxAnchor()

  const filteredEmployees = useMemo(() => {
    const query = employeeSearch.trim().toLowerCase()
    if (!query) return employees
    return employees.filter((employee) =>
      `${employee.fullName} ${employee.employeeCode}`.toLowerCase().includes(query),
    )
  }, [employees, employeeSearch])

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setApproverId('')
      setEmployeeSearch('')
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
            <Combobox value={approverId} onValueChange={(value) => setApproverId(value ?? '')}>
              <div ref={anchor}>
                <ComboboxInput
                  placeholder="Tìm nhân viên..."
                  showClear={!!approverId}
                  className="w-full h-9"
                  onChange={(event: ChangeEvent<HTMLInputElement>) => setEmployeeSearch(event.target.value)}
                />
              </div>
              <ComboboxContent anchor={anchor}>
                <ComboboxList className="max-h-60 overflow-y-auto [scrollbar-width:thin]">
                  {filteredEmployees.map((employee) => (
                    <ComboboxItem key={employee.id} value={employee.id}>
                      <span>{employee.fullName}</span>
                      {employee.employeeCode && (
                        <span className="ml-1 text-xs text-muted-foreground">({employee.employeeCode})</span>
                      )}
                    </ComboboxItem>
                  ))}
                  <ComboboxEmpty>Không tìm thấy nhân viên</ComboboxEmpty>
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
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
