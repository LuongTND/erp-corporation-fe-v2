import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { HRPageHeader } from '@/features/hr/components/HRPageHeader'
import EmployeeTypesPage from './EmployeeTypesPage'
import CustomFieldsPage from './CustomFieldsPage'

export default function ProfileComponentsPage() {
  return (
    <div className="h-full flex flex-col bg-background text-foreground">
      <HRPageHeader breadcrumbs={[{ label: 'Admin' }, { label: 'Thành phần hồ sơ', isActive: true }]} />

      <div className="flex flex-col flex-1 min-h-0 max-w-7xl w-full mx-auto px-4 md:px-8 py-5 gap-3">
        <div className="shrink-0">
          <h1 className="text-xl font-semibold">Thành phần hồ sơ</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Quản lý loại nhân sự và trường dữ liệu mở rộng</p>
        </div>

        <Tabs defaultValue="employee-types" className="flex flex-col flex-1 min-h-0">
          <TabsList className="shrink-0 w-fit">
            <TabsTrigger value="employee-types">Loại nhân sự</TabsTrigger>
            <TabsTrigger value="custom-fields">Trường tùy chỉnh</TabsTrigger>
          </TabsList>

          {/* ponytail: tab panels re-use existing page components; inner pages handle their own layout */}
          <TabsContent value="employee-types" className="flex-1 min-h-0 mt-3 -mx-4 md:-mx-8 -mb-5">
            <EmployeeTypesPage />
          </TabsContent>

          <TabsContent value="custom-fields" className="flex-1 min-h-0 mt-3 -mx-4 md:-mx-8 -mb-5">
            <CustomFieldsPage />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
