import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { useMyDetail, useMyCurrentSalary, useUpdateMyProfile } from '../hooks/use-my-profile'
import { mapToEmployeeDetail } from '../components/EmployeeDetailPage'
import { PersonalInfoTab } from '../components/EmployeeDetailPage/PersonalInfoTab'
import { WorkInfoTab } from '../components/EmployeeDetailPage/WorkInfoTab'
import { MyPayrollTab, EditMyProfileSheet, MyProfileCard, MyProfileCardSkeleton } from '../components/MyProfilePage'
import { MyDocumentsTab } from '../components/MyProfilePage/MyDocumentsTab'
import type { UpdateMyProfilePayload } from '../types/user-detail.types'

const TABS = [
  { value: 'personal',  label: 'Thông tin cá nhân' },
  { value: 'work',      label: 'Công việc'          },
  { value: 'payroll',   label: 'Lương'              },
  { value: 'documents', label: 'Tài liệu'           },
]

export default function MyProfilePage() {
  const [activeTab, setActiveTab] = useState('personal')
  const [visited, setVisited] = useState<Set<string>>(new Set(['personal']))
  const [editOpen, setEditOpen] = useState(false)

  const { data: dto, isLoading, isError } = useMyDetail()
  const { data: currentSalary, isLoading: isLoadingSalary } = useMyCurrentSalary(visited.has('payroll'))
  const { mutateAsync: updateMyProfile, isPending: isSaving } = useUpdateMyProfile()

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setVisited((prev) => new Set(prev).add(value))
  }

  const handleSave = async (payload: UpdateMyProfilePayload) => {
    await updateMyProfile(payload)
    setEditOpen(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-full bg-card">
        <div className="max-w-5xl mx-auto px-6 pt-6 pb-8 space-y-4">
          <MyProfileCardSkeleton />
          <Skeleton className="h-10 w-full rounded-lg" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Skeleton className="h-64 rounded-xl" />
            <Skeleton className="h-64 rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  if (isError || !dto) {
    return (
      <div className="min-h-full bg-card flex items-center justify-center">
        <p className="text-muted-foreground">Không tải được hồ sơ. Vui lòng thử lại.</p>
      </div>
    )
  }

  const employee = mapToEmployeeDetail(dto)

  return (
    <div className="min-h-full bg-card">
      <div className="max-w-5xl mx-auto px-6 pt-6 pb-8 space-y-4">
        <EditMyProfileSheet
          open={editOpen}
          employee={dto}
          isSaving={isSaving}
          onOpenChange={setEditOpen}
          onSave={handleSave}
        />

        <Tabs value={activeTab} onValueChange={handleTabChange} className="flex flex-col">
          <div className="sticky top-0 z-10 bg-card space-y-4 pb-2">
            <MyProfileCard employee={employee} onEditClick={() => setEditOpen(true)} />
            <TabsList className="w-full justify-start h-auto p-1 rounded-lg gap-0.5 overflow-x-auto bg-muted/50">
              {TABS.map((tab) => (
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
              <PersonalInfoTab employee={employee} customFields={dto.customFields} />
            </TabsContent>
            <TabsContent value="work">
              <WorkInfoTab employee={employee} employeeTypeName={dto.employeeTypeName} />
            </TabsContent>
            <TabsContent value="payroll">
              {visited.has('payroll') && (
                <MyPayrollTab current={currentSalary ?? undefined} isLoading={isLoadingSalary} />
              )}
            </TabsContent>
            <TabsContent value="documents">
              {visited.has('documents') && <MyDocumentsTab />}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
