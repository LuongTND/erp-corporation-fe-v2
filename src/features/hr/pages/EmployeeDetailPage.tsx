import { useState } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { ROUTES } from '@/config/routes'
import { useEmployeeDetail, useUpdateEmployee, useUpsertCustomFields, useUploadAvatar } from '../hooks/use-employee-detail'
import { useCurrentSalary, useSalaryHistory, useSetSalary } from '../hooks/use-salary'
import { useEmployeeDocuments, useUploadDocument, useDeleteDocument } from '../hooks/use-employee-documents'
import { useUserStatusHistory, useUpdateUserStatus } from '../hooks/use-user-status'
import { useWorkHistory, useLockEmployee } from '../hooks/use-work-history'
import { useCustomFields } from '@/features/admin/hooks/use-custom-fields'
import { useAssignEmployeeType } from '@/features/admin/hooks/use-employee-types'
import type { UpdateEmployeePayload } from '../types/user-detail.types'
import type { SetSalaryPayload } from '../types/salary.types'
import type { UploadDocumentPayload } from '../types/employee-document.types'
import type { UpdateUserStatusFormValues } from '../schemas/update-user-status.schema'
import type { WorkHistoryChangeType } from '../types/work-history.types'
import { EmployeeProfileCard } from '../components/EmployeeProfileCard'
import { PersonalInfoTab } from '../components/EmployeeDetailPage/PersonalInfoTab'
import { WorkInfoTab } from '../components/EmployeeDetailPage/WorkInfoTab'
import { AttendanceTab } from '../components/EmployeeDetailPage/AttendanceTab'
import { PayrollTab } from '../components/EmployeeDetailPage/PayrollTab'
import { KpiTab } from '../components/EmployeeDetailPage/KpiTab'
import { DocumentsTab } from '../components/EmployeeDetailPage/DocumentsTab'
import { ActivityLogTab } from '../components/EmployeeDetailPage/ActivityLogTab'
import { StatusTab } from '../components/EmployeeDetailPage/StatusTab'
import { WorkHistoryTab } from '../components/EmployeeDetailPage/WorkHistoryTab'
import type { UserStatus } from '../types/user-status.types'
import {
  EditEmployeeSheet,
  EmployeeDetailSkeleton,
  mapToEmployeeDetail,
} from '../components/EmployeeDetailPage'

const TABS = [
  { value: 'personal',     label: 'Thông tin cá nhân' },
  { value: 'work',         label: 'Công việc'          },
  { value: 'attendance',   label: 'Chấm công'          },
  { value: 'payroll',      label: 'Lương'              },
  { value: 'kpi',          label: 'KPI'                },
  { value: 'documents',    label: 'Tài liệu'           },
  { value: 'status',       label: 'Trạng thái'         },
  { value: 'workhistory',  label: 'Lịch sử CV'         },
  { value: 'activity',     label: 'Nhật ký'            },
]

export default function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: dto, isLoading, isError } = useEmployeeDetail(id ?? '')
  const { data: customFieldDefinitions = [] } = useCustomFields('Employee')

  const { mutate: uploadAvatar, isPending: isUploadingAvatar } = useUploadAvatar(id ?? '')
  const { data: docs = [], isLoading: isLoadingDocs } = useEmployeeDocuments(id ?? '')
  const { mutate: uploadDocument, isPending: isUploading } = useUploadDocument(id ?? '')
  const { mutate: deleteDocument } = useDeleteDocument(id ?? '')
  const { data: currentSalary, isLoading: loadingCurrentSalary } = useCurrentSalary(id ?? '')
  const { data: salaryHistory } = useSalaryHistory(id ?? '')
  const { mutate: setSalary, isPending: isPendingSalary } = useSetSalary(id ?? '')
  const { data: statusHistory, isLoading: isLoadingStatusHistory } = useUserStatusHistory(id ?? '')
  const { mutate: updateStatus, isPending: isPendingStatusUpdate } = useUpdateUserStatus(id ?? '')
  const [workHistoryFilter, setWorkHistoryFilter] = useState<WorkHistoryChangeType | undefined>()
  const { data: workHistory = [], isLoading: isLoadingWorkHistory } = useWorkHistory(id ?? '', workHistoryFilter)
  const { mutate: lockEmployee } = useLockEmployee(id ?? '')
  const updateEmployee = useUpdateEmployee(id ?? '')
  const upsertCustomFields = useUpsertCustomFields(id ?? '')
  const assignEmployeeType = useAssignEmployeeType()

  const handleUploadAvatar = (file: File, callbacks: { onSettled: () => void }) =>
    uploadAvatar(file, { onSettled: callbacks.onSettled })
  const handleUploadDocument = (payload: UploadDocumentPayload, callbacks: { onSuccess: () => void }) =>
    uploadDocument(payload, { onSuccess: callbacks.onSuccess })
  const handleUpdateStatus = (values: UpdateUserStatusFormValues, callbacks: { onSuccess: () => void }) =>
    updateStatus(values, { onSuccess: callbacks.onSuccess })
  const handleSetSalary = (payload: SetSalaryPayload, callbacks: { onSuccess: () => void }) =>
    setSalary(payload, { onSuccess: callbacks.onSuccess })
  const handleSaveEmployee = async (payload: UpdateEmployeePayload, customFields: { definitionId: string; value: string }[], employeeTypeId?: string | null) => {
    await updateEmployee.mutateAsync(payload)
    if (customFields.length > 0) await upsertCustomFields.mutateAsync(customFields)
    if (employeeTypeId !== undefined) await assignEmployeeType.mutateAsync({ userId: id!, employeeTypeId })
  }

  const [editOpen, setEditOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('personal')
  const [visited, setVisited] = useState<Set<string>>(new Set(['personal']))
  const handleTabChange = (v: string) => { setActiveTab(v); setVisited(p => new Set(p).add(v)) }
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
      <div className="max-w-5xl mx-auto px-6 pt-6 pb-8 space-y-4">
        <nav className="flex items-center gap-2 text-xs text-muted-foreground" aria-label="Breadcrumb">
          <Link to={backRoute} className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors">
            <ChevronLeft className="w-3.5 h-3.5" />
            Nhân viên
          </Link>
          <ChevronRight className="w-3 h-3" aria-hidden="true" />
          <span className="text-foreground">{dto.fullName}</span>
        </nav>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="flex flex-col">
          <div className="sticky top-0 z-10 bg-card space-y-4 pb-2">
            <EmployeeProfileCard employee={employee} isLocked={dto.isLocked} onEditClick={() => setEditOpen(true)} onUploadAvatar={handleUploadAvatar} isUploadingAvatar={isUploadingAvatar} onLockEmployee={lockEmployee} />
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
          </div>

          <div className="mt-2">
            <TabsContent value="personal">
              <PersonalInfoTab employee={employee} customFields={dto.customFields} customFieldDefinitions={customFieldDefinitions} />
            </TabsContent>
            <TabsContent value="work">
              <WorkInfoTab employee={employee} employeeTypeName={dto.employeeTypeName} />
            </TabsContent>
            <TabsContent value="attendance">{visited.has('attendance') && <AttendanceTab />}</TabsContent>
            <TabsContent value="payroll">{visited.has('payroll') && <PayrollTab current={currentSalary} loadingCurrent={loadingCurrentSalary} history={salaryHistory} onSetSalary={handleSetSalary} isPendingSalary={isPendingSalary} />}</TabsContent>
            <TabsContent value="kpi">{visited.has('kpi') && <KpiTab />}</TabsContent>
            <TabsContent value="documents">{visited.has('documents') && <DocumentsTab docs={docs} isLoading={isLoadingDocs} onUpload={handleUploadDocument} onDelete={deleteDocument} isUploading={isUploading} />}</TabsContent>
            <TabsContent value="status">
              {visited.has('status') && (
                // ponytail: dto.status is string from BE enum — safe cast, matches UserStatus values
                <StatusTab currentStatus={dto.status as UserStatus} history={statusHistory} isLoadingHistory={isLoadingStatusHistory} onUpdateStatus={handleUpdateStatus} isPendingUpdate={isPendingStatusUpdate} />
              )}
            </TabsContent>
            <TabsContent value="workhistory">
              {visited.has('workhistory') && (
                <WorkHistoryTab items={workHistory} isLoading={isLoadingWorkHistory} changeType={workHistoryFilter} onChangeTypeFilter={setWorkHistoryFilter} />
              )}
            </TabsContent>
            <TabsContent value="activity">{visited.has('activity') && <ActivityLogTab />}</TabsContent>
          </div>
        </Tabs>
      </div>

      <EditEmployeeSheet open={editOpen} employee={dto} onOpenChange={setEditOpen} onSave={handleSaveEmployee} />
    </div>
  )
}
