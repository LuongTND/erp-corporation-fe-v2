import { useState } from 'react'
import { useParams, Link, useLocation } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { ROUTES } from '@/config/routes'
import { useEmployeeDetail } from '../hooks/use-employee-detail'
import { EmployeeProfileCard } from '../components/EmployeeProfileCard'
import { PersonalInfoTab } from '../components/tabs/PersonalInfoTab'
import { WorkInfoTab } from '../components/tabs/WorkInfoTab'
import { AttendanceTab } from '../components/tabs/AttendanceTab'
import { PayrollTab } from '../components/tabs/PayrollTab'
import { KpiTab } from '../components/tabs/KpiTab'
import { DocumentsTab } from '../components/tabs/DocumentsTab'
import { ActivityLogTab } from '../components/tabs/ActivityLogTab'
import {
  EditEmployeeSheet,
  EmployeeDetailSkeleton,
  mapToEmployeeDetail,
} from '../components/EmployeeDetailPage'

const TABS = [
  { value: 'personal',   label: 'Thông tin cá nhân' },
  { value: 'work',       label: 'Công việc'          },
  { value: 'attendance', label: 'Chấm công'          },
  { value: 'payroll',    label: 'Lương'              },
  { value: 'kpi',        label: 'KPI'                },
  { value: 'documents',  label: 'Tài liệu'           },
  { value: 'activity',   label: 'Lịch sử'            },
]

export default function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: dto, isLoading, isError } = useEmployeeDetail(id ?? '')
  const [editOpen, setEditOpen] = useState(false)
  const location = useLocation()
  const backRoute = location.pathname.startsWith('/admin')
    ? ROUTES.ADMIN.EMPLOYEES
    : ROUTES.HR.EMPLOYEES

  if (isLoading) {
    return (
      <div className="min-h-full bg-card">
        <div className="max-w-6xl mx-auto p-8">
          <Skeleton className="h-3 w-40 mb-5" />
          <EmployeeDetailSkeleton />
        </div>
      </div>
    )
  }

  if (isError || !dto) {
    return (
      <div className="min-h-full bg-card flex items-center justify-center">
        <p className="text-muted-foreground">Không tìm thấy nhân viên.</p>
      </div>
    )
  }

  const employee = mapToEmployeeDetail(dto)

  return (
    <div className="min-h-full bg-card">
      <main className="max-w-5xl mx-auto p-6 space-y-4">
        {/* <nav className="flex items-center gap-1.5 text-xs text-muted-foreground" aria-label="Breadcrumb">
          <Link to={backRoute} className="hover:text-foreground transition-colors">Nhân viên</Link>
          <ChevronRight className="w-3 h-3" aria-hidden="true" />
          <span className="text-foreground">{dto.fullName}</span>
        </nav> */}
        <EmployeeProfileCard employee={employee} onEditClick={() => setEditOpen(true)} />

        <Tabs defaultValue="personal" className="flex flex-col">
          <TabsList className="w-full justify-start h-auto p-1 rounded-lg gap-0.5 overflow-x-auto bg-muted/50">
            {TABS.map(tab => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="text-sm text-muted-foreground data-[state=active]:bg-muted data-[state=active]:text-foreground data-[state=active]:shadow-none rounded-md px-3 py-2 font-medium whitespace-nowrap transition-colors"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="mt-5">
            <TabsContent value="personal">
              <PersonalInfoTab employee={employee} customFields={dto.customFields} />
            </TabsContent>
            <TabsContent value="work">
              <WorkInfoTab employee={employee} />
            </TabsContent>
            <TabsContent value="attendance"><AttendanceTab /></TabsContent>
            <TabsContent value="payroll"><PayrollTab /></TabsContent>
            <TabsContent value="kpi"><KpiTab /></TabsContent>
            <TabsContent value="documents"><DocumentsTab /></TabsContent>
            <TabsContent value="activity"><ActivityLogTab /></TabsContent>
          </div>
        </Tabs>
      </main>

      <EditEmployeeSheet open={editOpen} employee={dto} onOpenChange={setEditOpen} />
    </div>
  )
}
