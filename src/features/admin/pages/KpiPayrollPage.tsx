import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { HRPageHeader } from '@/features/hr/components/HRPageHeader'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useKpiEntries, useUpsertKpiEntry } from '../hooks/use-kpi-entries'
import { usePayrollRuns, useCreatePayrollRun } from '../hooks/use-payroll-runs'
import { upsertKpiEntrySchema } from '../schemas/kpi-entry.schema'
import { createPayrollRunSchema } from '../schemas/payroll-run.schema'
import type { UpsertKpiEntryValues } from '../schemas/kpi-entry.schema'
import type { CreatePayrollRunValues } from '../schemas/payroll-run.schema'
import { KpiTab, PayrollTab } from '../components/KpiPayrollPage'

const CURRENT_YEAR = new Date().getFullYear()

export default function KpiPayrollPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const defaultTab = location.pathname.includes('payroll') ? 'payroll' : 'kpi'

  const now = new Date()
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())
  const [kpiSheetOpen, setKpiSheetOpen] = useState(false)

  const [yearFilter, setYearFilter] = useState(CURRENT_YEAR)
  const [createOpen, setCreateOpen] = useState(false)

  const { data: entries = [], isLoading: isLoadingEntries } = useKpiEntries({ month, year })
  const upsert = useUpsertKpiEntry()

  const { data: runs = [], isLoading: isLoadingRuns } = usePayrollRuns(yearFilter)
  const create = useCreatePayrollRun()

  const kpiForm = useForm<UpsertKpiEntryValues>({
    resolver: zodResolver(upsertKpiEntrySchema),
    defaultValues: { month, year, actualValue: 0, score: 0 },
  })

  const createForm = useForm<CreatePayrollRunValues>({
    resolver: zodResolver(createPayrollRunSchema),
    defaultValues: { month: now.getMonth() + 1, year: CURRENT_YEAR },
  })

  const onKpiSubmit = (values: UpsertKpiEntryValues) => {
    upsert.mutate(values, {
      onSuccess: () => {
        setKpiSheetOpen(false)
        kpiForm.reset({ month, year, actualValue: 0, score: 0 })
      },
    })
  }

  const onCreateSubmit = (values: CreatePayrollRunValues) => {
    create.mutate(values, {
      onSuccess: (id) => {
        setCreateOpen(false)
        createForm.reset()
        navigate(`/admin/payroll-runs/${id}`)
      },
    })
  }

  return (
    <div className="h-full flex flex-col">
      <HRPageHeader breadcrumbs={[{ label: 'Admin' }, { label: 'KPI & Lương', isActive: true }]} />

      <Tabs defaultValue={defaultTab} className="flex flex-col flex-1 min-h-0">
        <div className="px-6 pt-3 border-b border-border/40 shrink-0">
          <TabsList className="h-8">
            <TabsTrigger value="kpi" className="text-sm">KPI</TabsTrigger>
            <TabsTrigger value="payroll" className="text-sm">Bảng lương</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="kpi" className="flex flex-col flex-1 min-h-0 mt-0 data-[state=inactive]:hidden">
          <KpiTab
            entries={entries}
            isLoading={isLoadingEntries}
            form={kpiForm}
            onSubmit={onKpiSubmit}
            isPending={upsert.isPending}
            month={month}
            year={year}
            onMonthChange={setMonth}
            onYearChange={setYear}
            sheetOpen={kpiSheetOpen}
            onSheetOpenChange={setKpiSheetOpen}
          />
        </TabsContent>
        <TabsContent value="payroll" className="flex flex-col flex-1 min-h-0 mt-0 data-[state=inactive]:hidden">
          <PayrollTab
            runs={runs}
            isLoading={isLoadingRuns}
            yearFilter={yearFilter}
            onYearFilterChange={setYearFilter}
            createOpen={createOpen}
            onCreateOpenChange={setCreateOpen}
            form={createForm}
            onSubmit={onCreateSubmit}
            isPending={create.isPending}
            onNavigate={id => navigate(`/admin/payroll-runs/${id}`)}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
