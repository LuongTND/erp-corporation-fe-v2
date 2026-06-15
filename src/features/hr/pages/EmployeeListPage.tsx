import { useMemo, useState } from 'react'
import { EmployeeBulkActionBar } from '../components/employee-list/EmployeeBulkActionBar'
import { EmployeeListFilters } from '../components/employee-list/EmployeeListFilters'
import { EmployeeListGrid } from '../components/employee-list/EmployeeListGrid'
import { EmployeeListPagination } from '../components/employee-list/EmployeeListPagination'
import { EmployeeListTable } from '../components/employee-list/EmployeeListTable'
import { EmployeeListToolbar } from '../components/employee-list/EmployeeListToolbar'
import { HRPageHeader } from '../components/HRPageHeader'
import type { EmployeeListDepartment, EmployeeListView } from '../types/employee-list.types'
import {
  EMPLOYEE_LIST_DEPARTMENTS,
  EMPLOYEE_LIST_ITEMS,
  EMPLOYEE_LIST_PAGE_SIZE,
  EMPLOYEE_LIST_TOTAL,
} from '../types/employee-list.types'

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function EmployeeListPage() {
  const [view, setView] = useState<EmployeeListView>('table')
  const [activeDept, setActiveDept] = useState<'All' | EmployeeListDepartment>('All')
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    return EMPLOYEE_LIST_ITEMS.filter((employee) => {
      const matchDept = activeDept === 'All' || employee.dept === activeDept
      const matchStatus = statusFilter === 'all' || employee.status.toLowerCase().replace(' ', '-') === statusFilter
      const q = search.toLowerCase()
      const matchSearch = !q
        || employee.name.toLowerCase().includes(q)
        || employee.id.toLowerCase().includes(q)
        || employee.position.toLowerCase().includes(q)

      return matchDept && matchStatus && matchSearch
    })
  }, [activeDept, statusFilter, search])

  const pageData = filtered.slice((page - 1) * EMPLOYEE_LIST_PAGE_SIZE, page * EMPLOYEE_LIST_PAGE_SIZE)
  const totalPages = Math.ceil(filtered.length / EMPLOYEE_LIST_PAGE_SIZE)

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

  return (
    <div className="min-h-full" style={{ backgroundColor: '#FAFAF8' }}>
      <HRPageHeader
        breadcrumbs={[
          { label: 'Modules' },
          { label: 'HR & Payroll', isActive: true },
          { label: 'Employees', isActive: true },
        ]}
      />

      <main className="max-w-7xl mx-auto p-8 space-y-5">
        <EmployeeListToolbar
          total={EMPLOYEE_LIST_TOTAL}
          shown={filtered.length}
          search={search}
          onSearchChange={(value) => {
            setSearch(value)
            setPage(1)
          }}
        />

        <EmployeeListFilters
          departments={EMPLOYEE_LIST_DEPARTMENTS}
          activeDept={activeDept}
          onDeptChange={(department) => {
            setActiveDept(department)
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

        <EmployeeListPagination
          page={page}
          totalPages={totalPages}
          pageSize={EMPLOYEE_LIST_PAGE_SIZE}
          shownCount={filtered.length}
          total={EMPLOYEE_LIST_TOTAL}
          onPageChange={setPage}
        />

      </main>

      <EmployeeBulkActionBar selectedCount={checked.size} onClear={() => setChecked(new Set())} />
    </div>
  )
}
