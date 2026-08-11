import { useState } from 'react'
import { employeesService } from '../services/employees.service'
import type { UserSummaryResponse } from '@/features/admin/types/admin.types'
import { useDepartments } from '@/features/admin/hooks/use-departments'
import { EmployeeBulkActionBar } from '../components/EmployeeListPage/EmployeeBulkActionBar'
import { EmployeeListFilters } from '../components/EmployeeListPage/EmployeeListFilters'
import { EmployeeListGrid } from '../components/EmployeeListPage/EmployeeListGrid'
import { EmployeeListPagination } from '../components/EmployeeListPage/EmployeeListPagination'
import { EmployeeListTable } from '../components/EmployeeListPage/EmployeeListTable'
import { EmployeeListToolbar } from '../components/EmployeeListPage/EmployeeListToolbar'
import { HRPageHeader } from '../components/HRPageHeader'
import { useEmployeeList } from '../hooks/use-employee-list'
import type { EmployeeListItem, EmployeeListView } from '../types/employee-list.types'
import { EMPLOYEE_LIST_PAGE_SIZE } from '../types/employee-list.types'

function toInitials(fullName: string): string {
  const words = fullName.trim().split(/\s+/)
  if (words.length >= 2) return (words[0][0] + words[words.length - 1][0]).toUpperCase()
  return fullName.slice(0, 2).toUpperCase()
}

function toListItem(u: UserSummaryResponse): EmployeeListItem {
  return {
    id: u.employeeCode || u.id,
    name: u.fullName,
    email: u.email,
    initials: toInitials(u.fullName),
    dept: '',
    position: '',
    status: u.status,
    joinDate: u.joinDate ? new Date(u.joinDate).toLocaleDateString('vi-VN') : '—',
    attendance: 0,
  }
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function EmployeeListPage() {
  const [view, setView] = useState<EmployeeListView>('table')
  const [activeDeptId, setActiveDeptId] = useState<string | undefined>()
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [page, setPage] = useState(1)
  const [isExporting, setIsExporting] = useState(false)

  const { data: deptsData } = useDepartments()
  const deptOptions = (deptsData?.items ?? []).map(d => ({ id: d.id, name: d.departmentName }))

  const apiStatus = statusFilter === 'all' ? undefined : statusFilter
  const apiSearch = search.trim() || undefined

  const { data: raw = [] } = useEmployeeList(apiSearch, apiStatus, activeDeptId)
  const employees = raw.map(toListItem)

  const pageData = employees.slice((page - 1) * EMPLOYEE_LIST_PAGE_SIZE, page * EMPLOYEE_LIST_PAGE_SIZE)
  const totalPages = Math.ceil(employees.length / EMPLOYEE_LIST_PAGE_SIZE)

  const toggleRow = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleAll = () => {
    if (pageData.every((e) => checked.has(e.id))) {
      setChecked((prev) => { const n = new Set(prev); pageData.forEach((e) => n.delete(e.id)); return n })
    } else {
      setChecked((prev) => { const n = new Set(prev); pageData.forEach((e) => n.add(e.id)); return n })
    }
  }

  const allChecked = pageData.length > 0 && pageData.every((e) => checked.has(e.id))

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const blob = await employeesService.exportUsers(apiSearch, apiStatus, activeDeptId)
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
      <div className="shrink-0">
        <HRPageHeader
          breadcrumbs={[
            { label: 'Modules' },
            { label: 'HR & Payroll', isActive: true },
            { label: 'Employees', isActive: true },
          ]}
        />
      </div>

      <div className="flex flex-col flex-1 min-h-0 max-w-7xl w-full mx-auto px-4 md:px-8 py-5 gap-4">
        <div className="shrink-0">
          <EmployeeListToolbar
            total={employees.length}
            shown={pageData.length}
            search={search}
            onSearchChange={(value) => {
              setSearch(value)
              setPage(1)
            }}
            onExport={handleExport}
            isExporting={isExporting}
          />
        </div>

        <div className="shrink-0">
          <EmployeeListFilters
            departments={deptOptions}
            activeDeptId={activeDeptId}
            onDeptChange={(id) => {
              setActiveDeptId(id)
              setPage(1)
            }}
            statusFilter={statusFilter}
            onStatusFilterChange={(value) => {
              setStatusFilter(value)
              setPage(1)
            }}
            view={view}
            onViewChange={setView}
          />
        </div>

        <div className="rounded-lg border bg-card overflow-auto max-h-full min-h-0">
          {view === 'table' ? (
            <EmployeeListTable
              employees={pageData}
              checkedIds={checked}
              allChecked={allChecked}
              onToggleAll={toggleAll}
              onToggleRow={toggleRow}
            />
          ) : (
            <EmployeeListGrid employees={pageData} />
          )}
        </div>

        <div className="shrink-0">
          <EmployeeListPagination
            page={page}
            totalPages={totalPages}
            pageSize={EMPLOYEE_LIST_PAGE_SIZE}
            shownCount={pageData.length}
            total={employees.length}
            onPageChange={setPage}
          />
        </div>

      </div>

      <EmployeeBulkActionBar selectedCount={checked.size} onClear={() => setChecked(new Set())} />
    </div>
  )
}
