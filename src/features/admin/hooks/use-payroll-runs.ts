import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { payrollRunsService } from '../services/payroll-runs.service'
import type { CreatePayrollRunPayload, UpdatePayrollEntryPayload } from '../types/payroll-run.types'

const KEY = 'payroll-runs'

export function usePayrollRuns(year?: number) {
  return useQuery({
    queryKey: [KEY, { year }],
    queryFn: () => payrollRunsService.list(year ? { year } : undefined),
  })
}

export function usePayrollRunById(id: string | null) {
  return useQuery({
    queryKey: [KEY, id],
    queryFn: () => payrollRunsService.getById(id!),
    enabled: !!id,
  })
}

export function useCreatePayrollRun() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (data: CreatePayrollRunPayload) => payrollRunsService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [KEY] })
      toast.success('Tạo bảng lương thành công')
    },
    onError: () => toast.error('Tạo bảng lương thất bại'),
  })
}

export function useUpdatePayrollEntry() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ entryId, data }: { entryId: string; data: UpdatePayrollEntryPayload }) =>
      payrollRunsService.updateEntry(entryId, data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [KEY] })
      toast.success('Cập nhật thành công')
    },
    onError: () => toast.error('Cập nhật thất bại'),
  })
}

export function useFinalizePayrollRun() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => payrollRunsService.finalize(id),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [KEY] })
      toast.success('Chốt bảng lương thành công')
    },
    onError: () => toast.error('Chốt bảng lương thất bại'),
  })
}
