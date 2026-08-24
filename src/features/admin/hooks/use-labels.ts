import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { labelsService } from '../services/labels.service'

const KEY = 'labels'

export function useLabels(params?: { search?: string; isActive?: boolean }) {
  return useQuery({
    queryKey: [KEY, params],
    queryFn: () => labelsService.list(params),
  })
}

export function useCreateLabel() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: labelsService.create,
    onSuccess: () => { client.invalidateQueries({ queryKey: [KEY] }); toast.success('Tạo nhãn thành công') },
    onError: () => toast.error('Tạo nhãn thất bại'),
  })
}

export function useUpdateLabel() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof labelsService.update>[1] }) =>
      labelsService.update(id, data),
    onSuccess: () => { client.invalidateQueries({ queryKey: [KEY] }); toast.success('Cập nhật nhãn thành công') },
    onError: () => toast.error('Cập nhật nhãn thất bại'),
  })
}

export function useDeleteLabel() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: labelsService.delete,
    onSuccess: () => { client.invalidateQueries({ queryKey: [KEY] }); toast.success('Xóa nhãn thành công') },
    onError: () => toast.error('Xóa nhãn thất bại'),
  })
}

export function useAssignLabel(userId: string) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (labelId: string) => labelsService.assignToUser(userId, labelId),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['employee-detail', userId] })
      client.invalidateQueries({ queryKey: ['employees'] })
    },
    onError: () => toast.error('Gán nhãn thất bại'),
  })
}

export function useRemoveLabel(userId: string) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (labelId: string) => labelsService.removeFromUser(userId, labelId),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['employee-detail', userId] })
      client.invalidateQueries({ queryKey: ['employees'] })
    },
    onError: () => toast.error('Gỡ nhãn thất bại'),
  })
}
