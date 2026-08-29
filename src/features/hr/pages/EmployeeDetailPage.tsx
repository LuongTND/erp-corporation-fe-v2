import { useState } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { ROUTES } from '@/config/routes'
import { useEmployeeDetail, useUpdateEmployee, useUpsertCustomFields, useUploadAvatar } from '../hooks/use-employee-detail'
import { useCurrentSalary, useSalaryHistory, useSetSalary } from '../hooks/use-salary'
import { useEmployeeDocuments, useUploadDocument, useDeleteDocument, useToggleDocumentVisibility } from '../hooks/use-employee-documents'
import { useUserStatusHistory, useUpdateUserStatus } from '../hooks/use-user-status'
import { useWorkHistory, useLockEmployee } from '../hooks/use-work-history'
import { useCustomFields } from '@/features/admin/hooks/use-custom-fields'
import { useAssignEmployeeType } from '@/features/admin/hooks/use-employee-types'
import type { UpdateEmployeePayload } from '../types/user-detail.types'
import type { SetSalaryPayload } from '../types/salary.types'
import type { UploadDocumentPayload } from '../types/employee-document.types'
import type { UpdateUserStatusFormValues } from '../schemas/update-user-status.schema'
import type { WorkHistoryChangeType } from '../types/work-history.types'
import { EmployeeSidebar } from '../components/EmployeeSidebar'
import { PersonalInfoTab } from '../components/EmployeeDetailPage/PersonalInfoTab/index'
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

const NAV_ITEMS = [
  { value: 'personal',    label: 'Thông tin cá nhân', description: 'Thông tin cá nhân, pháp lý và lý lịch' },
  { value: 'work',        label: 'Thông tin công việc', description: 'Công việc, sự nghiệp, tuyển dụng ...' },
  { value: 'payroll',     label: 'Lương & phúc lợi',  description: 'Bảng lương và phúc lợi' },
  { value: 'attendance',  label: 'Chấm công',          description: 'Mã chấm công và lịch sử' },
  { value: 'kpi',         label: 'KPI',                description: 'Đánh giá hiệu suất' },
  { value: 'documents',   label: 'Tài liệu',           description: 'Hồ sơ, giấy tờ nhân viên' },
  { value: 'status',      label: 'Trạng thái',         description: 'Lịch sử trạng thái nhân sự' },
  { value: 'workhistory', label: 'Lịch sử CV',         description: 'Các vị trí đã đảm nhiệm' },
  { value: 'activity',   label: 'Nhật ký',            description: 'Hoạt động và thay đổi' },
]

export default function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [editOpen, setEditOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('personal')
  const [visited, setVisited] = useState<Set<string>>(new Set(['personal']))
  const [workHistoryFilter, setWorkHistoryFilter] = useState<WorkHistoryChangeType | undefined>()

  const handleTabChange = (v: string) => { setActiveTab(v); setVisited(p => new Set(p).add(v)) }
  const seen = (tab: string) => visited.has(tab)

  const { data: dto, isLoading, isError } = useEmployeeDetail(id ?? '')
  const { data: customFieldDefinitions = [] } = useCustomFields('Employee')
  const { mutate: uploadAvatar, isPending: isUploadingAvatar } = useUploadAvatar(id ?? '')
  const { mutate: uploadDocument, isPending: isUploading } = useUploadDocument(id ?? '')
  const { mutate: deleteDocument } = useDeleteDocument(id ?? '')
  const { mutate: toggleVisibility } = useToggleDocumentVisibility(id ?? '')
  const { mutate: setSalary, isPending: isPendingSalary } = useSetSalary(id ?? '')
  const { mutate: updateStatus, isPending: isPendingStatusUpdate } = useUpdateUserStatus(id ?? '')
  const { mutate: lockEmployee } = useLockEmployee(id ?? '')
  const updateEmployee = useUpdateEmployee(id ?? '')
  const upsertCustomFields = useUpsertCustomFields(id ?? '')
  const assignEmployeeType = useAssignEmployeeType()

  const { data: docs = [], isLoading: isLoadingDocs } = useEmployeeDocuments(id ?? '', seen('documents'))
  const { data: currentSalary, isLoading: loadingCurrentSalary } = useCurrentSalary(id ?? '', seen('payroll'))
  const { data: salaryHistory } = useSalaryHistory(id ?? '', seen('payroll'))
  const { data: statusHistory, isLoading: isLoadingStatusHistory } = useUserStatusHistory(id ?? '', seen('status'))
  const { data: workHistory = [], isLoading: isLoadingWorkHistory } = useWorkHistory(id ?? '', workHistoryFilter, seen('workhistory'))

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

  const location = useLocation()
  const backRoute = location.pathname.startsWith('/admin') ? ROUTES.ADMIN.EMPLOYEES : ROUTES.HR.EMPLOYEES

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
    <div className="h-full flex flex-col bg-background">
      {/* Breadcrumb */}
      <div className="shrink-0 px-6 py-3 border-b border-border bg-card">
        <nav className="flex items-center gap-2 text-xs text-muted-foreground" aria-label="Breadcrumb">
          <Link to={backRoute} className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors">
            <ChevronLeft className="w-3.5 h-3.5" />
            Danh sách nhân sự
          </Link>
          <ChevronRight className="w-3 h-3" aria-hidden="true" />
          <span className="text-foreground">{dto.fullName}</span>
        </nav>
      </div>

      {/* Main 2-col layout */}
      <div className="flex flex-1 min-h-0 bg-background">
        <EmployeeSidebar
          employee={employee}
          isLocked={dto.isLocked}
          status={dto.status}
          activeTab={activeTab}
          navItems={NAV_ITEMS}
          onTabChange={handleTabChange}
          onEditClick={() => setEditOpen(true)}
          onUploadAvatar={handleUploadAvatar}
          isUploadingAvatar={isUploadingAvatar}
          onLockEmployee={lockEmployee}
        />

        {/* Right scrollable content */}
        <main className="flex-1 min-w-0 overflow-y-auto bg-card">
          {/* Content header */}
          <div className="sticky top-0 z-10 px-6 pt-6 pb-2 border-b border-border bg-card">
            <h2 className="text-xl font-semibold text-foreground">
              {NAV_ITEMS.find(n => n.value === activeTab)?.label ?? ''}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {NAV_ITEMS.find(n => n.value === activeTab)?.description ?? ''}
            </p>
          </div>

          {/* Tab content */}
          <div className="py-2">
            {activeTab === 'personal' && (
              <PersonalInfoTab employee={employee} customFields={dto.customFields} customFieldDefinitions={customFieldDefinitions} />
            )}
            {activeTab === 'work' && (
              <div className="px-6 py-4">
                <WorkInfoTab employee={employee} employeeTypeName={dto.employeeTypeName} />
              </div>
            )}
            {activeTab === 'attendance' && seen('attendance') && (
              <div className="px-6 py-4"><AttendanceTab /></div>
            )}
            {activeTab === 'payroll' && seen('payroll') && (
              <div className="px-6 py-4">
                <PayrollTab current={currentSalary ?? undefined} loadingCurrent={loadingCurrentSalary} history={salaryHistory} onSetSalary={handleSetSalary} isPendingSalary={isPendingSalary} />
              </div>
            )}
            {activeTab === 'kpi' && seen('kpi') && (
              <div className="px-6 py-4"><KpiTab /></div>
            )}
            {activeTab === 'documents' && seen('documents') && (
              <div className="px-6 py-4">
                <DocumentsTab docs={docs} isLoading={isLoadingDocs} employeeId={id ?? ''} onUpload={handleUploadDocument} onDelete={deleteDocument} onToggleVisibility={(documentId, isVisible) => toggleVisibility({ documentId, isVisibleToEmployee: isVisible })} isUploading={isUploading} />
              </div>
            )}
            {activeTab === 'status' && seen('status') && (
              <div className="px-6 py-4">
                {/* ponytail: dto.status is string from BE enum — safe cast, matches UserStatus values */}
                <StatusTab currentStatus={dto.status as UserStatus} history={statusHistory} isLoadingHistory={isLoadingStatusHistory} onUpdateStatus={handleUpdateStatus} isPendingUpdate={isPendingStatusUpdate} />
              </div>
            )}
            {activeTab === 'workhistory' && seen('workhistory') && (
              <div className="px-6 py-4">
                <WorkHistoryTab items={workHistory} isLoading={isLoadingWorkHistory} changeType={workHistoryFilter} onChangeTypeFilter={setWorkHistoryFilter} />
              </div>
            )}
            {activeTab === 'activity' && seen('activity') && (
              <div className="px-6 py-4"><ActivityLogTab /></div>
            )}
          </div>
        </main>
      </div>

      <EditEmployeeSheet open={editOpen} employee={dto} onOpenChange={setEditOpen} onSave={handleSaveEmployee} />
    </div>
  )
}
