import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { Download, Plus, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { employeesService } from '@/features/hr/services/employees.service'
import { HRPageHeader } from '@/features/hr/components/HRPageHeader'
import { ROUTES } from '@/config/routes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCreateEmployee, useEmployees, useUpdateUserStatus } from '../hooks/use-employees'
import { useDepartments } from '../hooks/use-departments'
import { useJobLevels } from '../hooks/use-job-levels'
import { useAllUsers } from '../hooks/use-roles'
import { createEmployeeSchema, type CreateEmployeeFormValues } from '../schemas/admin.schemas'
import { CreateEmployeeSheet, EmployeeTable } from '../components/EmployeesPage'
import { useDebounce } from '@/hooks/use-debounce'

export default function EmployeesPage() {
  const navigate = useNavigate()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState<number>(15)
  const [isExporting, setIsExporting] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')
  const [activeDeptId, setActiveDeptId] = useState<string | undefined>()
  const debouncedSearch = useDebounce(search, 300)

  const apiStatus = statusFilter === 'all' ? undefined : statusFilter

  const { data: employees = [], isLoading } = useEmployees(debouncedSearch || undefined, undefined, undefined, apiStatus, activeDeptId)
  const { data: deptsData } = useDepartments()
  const deptOptions = (deptsData?.items ?? []).map(d => ({ id: d.id, name: d.departmentName }))

  const create = useCreateEmployee()
  const updateStatus = useUpdateUserStatus()
  const { data: jobLevelsData } = useJobLevels({ Top: 100, NeedTotalCount: false })
  const { data: allUsers } = useAllUsers()

  const form = useForm<CreateEmployeeFormValues>({
    resolver: zodResolver(createEmployeeSchema),
    defaultValues: { dateOfJoin: new Date().toISOString().slice(0, 10) },
  })

  useEffect(() => {
    if (sheetOpen) form.reset({ dateOfJoin: new Date().toISOString().slice(0, 10) })
  }, [sheetOpen, form])

  const onSubmit = async (values: CreateEmployeeFormValues) => {
    const payload = {
      ...values,
      employeeCode: values.employeeCode || undefined,
      gender: values.gender || undefined,
      dateOfBirth: values.dateOfBirth || undefined,
      identityCardNumber: values.identityCardNumber || undefined,
      identityCardIssuedDate: values.identityCardIssuedDate || undefined,
      identityCardIssuedPlace: values.identityCardIssuedPlace || undefined,
      phoneNumber: values.phoneNumber || undefined,
      permanentAddress: values.permanentAddress || undefined,
      currentAddress: values.currentAddress || undefined,
      taxCode: values.taxCode || undefined,
      socialInsuranceCode: values.socialInsuranceCode || undefined,
      managerId: values.managerId || undefined,
      contractType: values.contractType || undefined,
      bankName: values.bankName || undefined,
      bankAccountNumber: values.bankAccountNumber || undefined,
      customFieldValues:
        values.customFieldValues && Object.keys(values.customFieldValues).length > 0
          ? values.customFieldValues
          : undefined,
    }
    await create.mutateAsync(payload)
    setSheetOpen(false)
  }

  const totalCount = employees.length
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
  const safePage = Math.min(page, totalPages)
  const start = (safePage - 1) * pageSize
  const paginated = employees.slice(start, start + pageSize)

  function handleSearch(value: string) { setSearch(value); setPage(1) }
  function handleDeptChange(id: string | undefined) { setActiveDeptId(id); setPage(1) }
  function handleStatusChange(value: string) { setStatusFilter(value); setPage(1) }

  async function handleExport() {
    setIsExporting(true)
    try {
      const blob = await employeesService.exportUsers(debouncedSearch || undefined, apiStatus, activeDeptId)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `nhan-su-${new Date().toISOString().slice(0, 10)}.xlsx`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="h-full flex flex-col bg-background text-foreground">
      <HRPageHeader breadcrumbs={[{ label: 'Admin' }, { label: 'Nhân sự', isActive: true }]} />

      <div className="flex flex-col flex-1 min-h-0 max-w-7xl w-full mx-auto px-4 md:px-8 py-5 gap-4">

        {/* Header */}
        <div className="flex items-center justify-between gap-4 shrink-0">
          <div>
            <h1 className="text-xl font-semibold">Nhân sự</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {isLoading ? <Skeleton className="h-4 w-24 inline-block" /> : `${totalCount} nhân viên`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={handleExport} disabled={isExporting}>
              <Download className="h-3.5 w-3.5" />
              {isExporting ? 'Đang xuất...' : 'Xuất Excel'}
            </Button>
            <Button onClick={() => setSheetOpen(true)} size="sm" className="gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              Tạo nhân sự
            </Button>
          </div>
        </div>

        {/* Search + Status filter */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-8"
              placeholder="Tìm theo tên, mã nhân viên..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={handleStatusChange}>
            <SelectTrigger className="h-9 w-40 text-sm">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="Active">Đang làm</SelectItem>
              <SelectItem value="Official">Chính thức</SelectItem>
              <SelectItem value="Probation">Thử việc</SelectItem>
              <SelectItem value="Apprentice">Học việc</SelectItem>
              <SelectItem value="Suspended">Tạm nghỉ</SelectItem>
              <SelectItem value="MaternityLeave">Thai sản</SelectItem>
              <SelectItem value="Resigned">Đã nghỉ</SelectItem>
              <SelectItem value="Terminated">Chấm dứt HĐ</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Dept filter tabs */}
        {deptOptions.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => handleDeptChange(undefined)}
              className={cn(
                'h-7 cursor-pointer rounded-full border px-3 text-xs font-medium transition-colors',
                activeDeptId === undefined
                  ? 'border-border bg-muted text-foreground'
                  : 'border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground',
              )}
            >
              Tất cả
            </button>
            {deptOptions.map(dept => (
              <button
                key={dept.id}
                type="button"
                onClick={() => handleDeptChange(dept.id)}
                className={cn(
                  'h-7 cursor-pointer rounded-full border px-3 text-xs font-medium transition-colors',
                  activeDeptId === dept.id
                    ? 'border-border bg-muted text-foreground'
                    : 'border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground',
                )}
              >
                {dept.name}
              </button>
            ))}
          </div>
        )}

        <EmployeeTable
          employees={paginated}
          isLoading={isLoading}
          pageSize={pageSize}
          totalCount={totalCount}
          currentPage={safePage}
          totalPages={totalPages}
          start={start}
          onRowClick={(id) => navigate(ROUTES.ADMIN.EMPLOYEE_DETAIL.replace(':id', id))}
          onPageChange={setPage}
          onPageSizeChange={(size) => { setPageSize(size); setPage(1) }}
          onStatusChange={(userId, newStatus) => updateStatus.mutate({ userId, newStatus })}
          isUpdatingStatus={updateStatus.isPending}
        />
      </div>

      <CreateEmployeeSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        form={form}
        onSubmit={onSubmit}
        isPending={create.isPending}
        jobLevels={jobLevelsData?.items ?? []}
        managers={allUsers ?? []}
      />
    </div>
  )
}
