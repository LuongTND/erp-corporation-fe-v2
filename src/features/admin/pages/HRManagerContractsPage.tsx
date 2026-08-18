import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertTriangle, Plus } from 'lucide-react'
import { HRPageHeader } from '@/features/hr/components/HRPageHeader'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  useContracts,
  useExpiringContracts,
  useCreateContract,
  useRenewContract,
  useTerminateContract,
  useContractTemplates,
} from '../hooks/use-contracts'
import { useEmployees } from '../hooks/use-employees'
import { useJobLevels } from '../hooks/use-job-levels'
import { createContractSchema, renewContractSchema, type CreateContractFormValues, type RenewContractFormValues } from '../schemas/contract.schema'
import {
  ContractTable,
  CreateContractSheet,
  RenewContractDialog,
  TerminateContractDialog,
} from '../components/ContractsPage'
import type { EmploymentContractResponse } from '../types/admin.types'

function extractFile(value: unknown): File {
  if (value instanceof File) return value
  if (value instanceof FileList && value.length > 0) return value[0]
  throw new Error('File là bắt buộc')
}

export default function HRManagerContractsPage() {
  const [selectedUserId, setSelectedUserId] = useState<string>('')
  const [createOpen, setCreateOpen] = useState(false)
  const [renewTarget, setRenewTarget] = useState<EmploymentContractResponse | null>(null)
  const [terminateTarget, setTerminateTarget] = useState<EmploymentContractResponse | null>(null)

  const { data: employees = [], isLoading: loadingEmployees } = useEmployees()
  const { data: contracts = [], isLoading: loadingContracts } = useContracts(selectedUserId)
  const { data: expiring = [] } = useExpiringContracts(30)
  const { data: templates = [] } = useContractTemplates()
  const { data: jobLevelsData } = useJobLevels({ take: 200 })
  const jobLevels = jobLevelsData?.items ?? []

  const createContract = useCreateContract()
  const renewContract = useRenewContract(selectedUserId)
  const terminateContract = useTerminateContract(selectedUserId)

  const createForm = useForm<CreateContractFormValues>({
    resolver: zodResolver(createContractSchema),
    defaultValues: { startDate: new Date().toISOString().slice(0, 10) },
  })
  const renewForm = useForm<RenewContractFormValues>({ resolver: zodResolver(renewContractSchema) })

  async function handleCreate(values: CreateContractFormValues) {
    await createContract.mutateAsync({
      userId: selectedUserId,
      type: values.type,
      startDate: values.startDate,
      endDate: values.endDate,
      salary: values.salary,
      salaryForSocialInsurance: values.salaryForSocialInsurance,
      positionTitle: values.positionTitle,
      signedDate: values.signedDate,
      templateId: values.templateId || undefined,
      file: extractFile(values.file),
    })
    setCreateOpen(false)
    createForm.reset()
  }

  async function handleRenew(values: RenewContractFormValues) {
    if (!renewTarget) return
    await renewContract.mutateAsync({
      contractId: renewTarget.id,
      data: {
        type: values.type,
        startDate: values.startDate,
        endDate: values.endDate,
        salary: values.salary,
        salaryForSocialInsurance: values.salaryForSocialInsurance,
        positionTitle: values.positionTitle,
        signedDate: values.signedDate,
        file: extractFile(values.file),
      },
    })
    setRenewTarget(null)
    renewForm.reset()
  }

  async function handleTerminate(reason: string) {
    if (!terminateTarget) return
    await terminateContract.mutateAsync({ contractId: terminateTarget.id, data: { terminationReason: reason } })
    setTerminateTarget(null)
  }

  const selectedEmployee = employees.find((e) => e.id === selectedUserId)

  return (
    <div className="h-full flex flex-col bg-background text-foreground">
      <HRPageHeader breadcrumbs={[{ label: 'HR Manager' }, { label: 'Hợp đồng nhân sự', isActive: true }]} />

      <div className="flex flex-col flex-1 min-h-0 max-w-7xl w-full mx-auto px-4 md:px-8 py-5 gap-4">

        <div className="flex items-center justify-between gap-4 shrink-0">
          <div>
            <h1 className="text-xl font-semibold">Hợp đồng nhân sự</h1>
            <p className="text-sm text-muted-foreground mt-0.5 min-h-[20px]">
              {expiring.length > 0 && (
                <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400">
                  <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
                  {expiring.length} hợp đồng sắp hết hạn trong 30 ngày
                </span>
              )}
            </p>
          </div>
          {selectedUserId && (
            <Button onClick={() => setCreateOpen(true)} size="sm" className="gap-1.5 cursor-pointer">
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              Tạo hợp đồng
            </Button>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="w-72">
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger className="h-9 cursor-pointer">
                <SelectValue placeholder="Chọn nhân viên..." />
              </SelectTrigger>
              <SelectContent align="start" sideOffset={4}>
                {loadingEmployees ? (
                  <div className="p-2"><Skeleton className="h-4 w-40" /></div>
                ) : (
                  employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.fullName}
                      {employee.employeeCode && (
                        <span className="text-muted-foreground ml-1.5 text-xs">({employee.employeeCode})</span>
                      )}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          {selectedEmployee && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{selectedEmployee.email}</span>
              {contracts.some((c) => c.status === 'Active') && (
                <Badge variant="default" className="text-xs">Đang có HĐ hiệu lực</Badge>
              )}
            </div>
          )}
        </div>

        {expiring.length > 0 && !selectedUserId && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30 px-4 py-3 shrink-0">
            <p className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-2">
              Hợp đồng sắp hết hạn (trong 30 ngày)
            </p>
            <div className="flex flex-wrap gap-2">
              {expiring.map((contract) => (
                <button
                  key={contract.id}
                  type="button"
                  className="cursor-pointer inline-flex items-center gap-1.5 rounded-md border border-amber-200 bg-white dark:bg-amber-900/30 dark:border-amber-800 px-2.5 py-1 text-xs hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors duration-150"
                  onClick={() => setSelectedUserId(contract.userId)}
                >
                  <span className="font-mono">{contract.contractNumber}</span>
                  {contract.endDate && (
                    <span className="text-amber-600 dark:text-amber-400">
                      hết hạn {new Date(contract.endDate).toLocaleDateString('vi-VN')}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedUserId ? (
          <ContractTable
            contracts={contracts}
            isLoading={loadingContracts}
            onRenew={(contract) => {
              setRenewTarget(contract)
              renewForm.reset({ type: contract.type, startDate: new Date().toISOString().slice(0, 10), salary: contract.salary })
            }}
            onTerminate={setTerminateTarget}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
            Chọn nhân viên để xem danh sách hợp đồng
          </div>
        )}
      </div>

      <CreateContractSheet
        open={createOpen}
        onOpenChange={setCreateOpen}
        form={createForm}
        onSubmit={handleCreate}
        isPending={createContract.isPending}
        templates={templates}
        jobLevels={jobLevels}
      />
      <RenewContractDialog
        open={!!renewTarget}
        onOpenChange={(open) => { if (!open) { setRenewTarget(null); renewForm.reset() } }}
        contract={renewTarget}
        form={renewForm}
        onSubmit={handleRenew}
        isPending={renewContract.isPending}
        jobLevels={jobLevels}
      />
      <TerminateContractDialog
        open={!!terminateTarget}
        onOpenChange={(open) => { if (!open) setTerminateTarget(null) }}
        contract={terminateTarget}
        onConfirm={handleTerminate}
        isPending={terminateContract.isPending}
      />
    </div>
  )
}
