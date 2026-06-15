import { ChevronRight } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EmployeeProfileCard } from '../components/EmployeeProfileCard'
import { PersonalInfoTab } from '../components/tabs/PersonalInfoTab'
import { WorkInfoTab } from '../components/tabs/WorkInfoTab'
import { AttendanceTab } from '../components/tabs/AttendanceTab'
import { PayrollTab } from '../components/tabs/PayrollTab'
import { KpiTab } from '../components/tabs/KpiTab'
import { DocumentsTab } from '../components/tabs/DocumentsTab'
import { ActivityLogTab } from '../components/tabs/ActivityLogTab'
import type { EmployeeDetail } from '../types/employee.types'

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_EMPLOYEE: EmployeeDetail = {
  id:             'EMP-0042',
  fullName:       'Nguyễn Văn An',
  position:       'Senior Product Designer',
  department:     'Product',
  employmentType: 'Full-time',
  employeeCode:   'EMP-0042',
  joinDate:       '15 Jan 2022',
  initials:       'NVA',
  isOnline:       true,

  // Personal Info
  dateOfBirth:      '12 Aug 1992',
  gender:           'Male',
  nationality:      'Vietnamese',
  personalEmail:    'nguyenvanan@gmail.com',
  personalPhone:    '+84 912 345 678',
  idNumber:         '079092012345',
  idExpiry:         '15 Mar 2028',
  permanentAddress: '45 Trần Phú, Phường 4,\nQuận 5, Thành phố Hồ Chí Minh',

  emergencyContact: {
    name:         'Nguyễn Thị Lan',
    relationship: 'Spouse',
    phone:        '+84 909 876 543',
  },
  bankAccount: {
    bankName:            'Vietcombank',
    accountNumberMasked: '**** **** **** 4821',
  },
  socialInsuranceNumber: 'BH-7823456',
  taxCode:               '8823456789',

  // Work Info
  manager: {
    id:       'EMP-0006',
    name:     'Tống Minh Long',
    initials: 'TML',
  },
  workLocation:    'Hybrid',
  workSchedule:    'Mon–Fri · 08:00–17:00',
  contractType:    'Indefinite Term',
  contractEndDate: 'N/A',

  salaryGrade:     'Grade 4',
  salaryRange:     '₫18M–25M',
  probationStatus: 'Completed',
  probationEndDate:'15 Apr 2022',

  itEquipment: [
    { id: '1', name: 'MacBook Pro 14"', serialNumber: 'C02ZM3XKMD6N', assignedDate: '20 Jan 2022' },
    { id: '2', name: 'Dell Monitor 27"', serialNumber: 'DEL-7823-XZ',  assignedDate: '20 Jan 2022' },
  ],
  systemRoles: ['HR Manager', 'Employee'],
}

// ─── Tab config ───────────────────────────────────────────────────────────────

const TABS = [
  { value: 'personal',   label: 'Personal Info'  },
  { value: 'work',       label: 'Work Info'      },
  { value: 'attendance', label: 'Attendance'     },
  { value: 'payroll',    label: 'Payroll'        },
  { value: 'kpi',        label: 'KPI'            },
  { value: 'documents',  label: 'Documents'      },
  { value: 'activity',   label: 'Activity'       },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EmployeeDetailPage() {
  return (
    <div className="min-h-full" style={{ backgroundColor: '#faf9f5' }}>

      {/* Sticky page header */}
      <header
        className="sticky top-0 z-10 flex items-center px-8 h-14 border-b"
        style={{ backgroundColor: '#faf9f5', borderColor: '#e6dfd8' }}
      >
        <nav className="flex items-center gap-1.5 text-sm" aria-label="Breadcrumb">
          <a
            href="/hr/employees"
            className="text-[#6c6a64] hover:text-[#141413] transition-colors"
          >
            Employees
          </a>
          <ChevronRight className="w-3.5 h-3.5 text-[#8e8b82]" aria-hidden="true" />
          <span className="text-[#141413] font-medium">{MOCK_EMPLOYEE.fullName}</span>
        </nav>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto p-8 space-y-5">

        {/* Profile card */}
        <EmployeeProfileCard employee={MOCK_EMPLOYEE} />

        {/* Tabs */}
        <Tabs defaultValue="personal" className="flex flex-col">
          <TabsList
            className="w-full justify-start h-auto p-1 rounded-lg gap-0.5 overflow-x-auto"
            style={{ backgroundColor: '#f5f0e8' }}
          >
            {TABS.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="text-sm text-[#6c6a64] data-[state=active]:bg-[#efe9de] data-[state=active]:text-[#141413] data-[state=active]:shadow-none rounded-md px-3 py-2 font-medium whitespace-nowrap transition-colors"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="mt-5">
            <TabsContent value="personal">
              <PersonalInfoTab employee={MOCK_EMPLOYEE} />
            </TabsContent>

            <TabsContent value="work">
              <WorkInfoTab employee={MOCK_EMPLOYEE} />
            </TabsContent>

            <TabsContent value="attendance">
              <AttendanceTab />
            </TabsContent>

            <TabsContent value="payroll">
              <PayrollTab />
            </TabsContent>

            <TabsContent value="kpi">
              <KpiTab />
            </TabsContent>

            <TabsContent value="documents">
              <DocumentsTab />
            </TabsContent>

            <TabsContent value="activity">
              <ActivityLogTab />
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  )
}
