import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { countersService } from '../services/counters.service'
import type { CounterPayload } from '../types/admin.types'

export function useCounters(params?: { storeId?: string; searchText?: string }) {
  return useQuery({
    queryKey: ['counters', params],
    queryFn: () => countersService.list({ ...params, top: 200 }),
  })
}

export function useCreateCounter() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (data: CounterPayload) => countersService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['counters'] })
      toast.success('Đã tạo quầy mới')
    },
    onError: () => toast.error('Tạo quầy thất bại'),
  })
}

export function useUpdateCounter() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name: string; code: string } }) =>
      countersService.update(id, data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['counters'] })
      toast.success('Đã cập nhật quầy')
    },
    onError: () => toast.error('Cập nhật quầy thất bại'),
  })
}

export function useToggleCounterActive() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => countersService.toggleActive(id),
    onSuccess: (isActive) => {
      client.invalidateQueries({ queryKey: ['counters'] })
      toast.success(isActive ? 'Đã kích hoạt quầy' : 'Đã ngưng hoạt động quầy')
    },
    onError: () => toast.error('Cập nhật trạng thái quầy thất bại'),
  })
}

export function useDeleteCounter() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => countersService.delete(id),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['counters'] })
      toast.success('Đã xóa quầy')
    },
    onError: () => toast.error('Xóa quầy thất bại'),
  })
}
