import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { contractsService, contractTemplatesService } from '../services/contracts.service'
import type { CreateContractPayload, RenewContractPayload, TerminateContractPayload } from '../types/admin.types'

const KEY = 'contracts'

export function useContracts(userId: string) {
  return useQuery({
    queryKey: [KEY, userId],
    queryFn: () => contractsService.list(userId),
    enabled: !!userId,
    staleTime: 60_000,
  })
}

export function useExpiringContracts(days = 30) {
  return useQuery({
    queryKey: [KEY, 'expiring', days],
    queryFn: () => contractsService.listExpiring(days),
    staleTime: 60_000,
  })
}

export function useCreateContract() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateContractPayload) => contractsService.create(data),
    onSuccess: (_, vars) => {
      client.invalidateQueries({ queryKey: [KEY, vars.userId] })
      toast.success('Tạo hợp đồng thành công')
    },
    onError: (error) => { console.error(error); toast.error('Tạo hợp đồng thất bại') },
  })
}

export function useRenewContract(userId: string) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ contractId, data }: { contractId: string; data: RenewContractPayload }) =>
      contractsService.renew(userId, contractId, data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [KEY, userId] })
      toast.success('Gia hạn hợp đồng thành công')
    },
    onError: (error) => { console.error(error); toast.error('Gia hạn hợp đồng thất bại') },
  })
}

export function useTerminateContract(userId: string) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ contractId, data }: { contractId: string; data: TerminateContractPayload }) =>
      contractsService.terminate(userId, contractId, data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [KEY, userId] })
      toast.success('Chấm dứt hợp đồng thành công')
    },
    onError: (error) => { console.error(error); toast.error('Chấm dứt hợp đồng thất bại') },
  })
}

const TEMPLATE_KEY = 'contract-templates'

export function useContractTemplates() {
  return useQuery({
    queryKey: [TEMPLATE_KEY],
    queryFn: () => contractTemplatesService.list(),
    staleTime: 120_000,
  })
}

export function useUploadContractTemplate() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ name, description, file }: { name: string; description?: string; file: File }) =>
      contractTemplatesService.upload(name, description, file),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [TEMPLATE_KEY] })
      toast.success('Tải lên mẫu hợp đồng thành công')
    },
    onError: (error) => { console.error(error); toast.error('Tải lên mẫu thất bại') },
  })
}

export function useDownloadContractTemplate() {
  return useMutation({
    mutationFn: async ({ id, fileName }: { id: string; fileName: string }) => {
      const blob = await contractTemplatesService.download(id)
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    },
    onError: (error) => { console.error(error); toast.error('Tải về mẫu thất bại') },
  })
}


export function useDeleteContractTemplate() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => contractTemplatesService.delete(id),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [TEMPLATE_KEY] })
      toast.success('Đã xoá mẫu hợp đồng')
    },
    onError: (error) => { console.error(error); toast.error('Xoá mẫu thất bại') },
  })
}
