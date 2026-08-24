import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { recruitmentApproverService } from '../services/recruitment-approver.service'
import type { SetRecruitmentApproverPayload } from '../types/admin.types'

const KEY = 'recruitment-approver-configs'

export function useRecruitmentApprovers() {
  return useQuery({
    queryKey: [KEY],
    queryFn: () => recruitmentApproverService.list(),
    staleTime: 60_000,
  })
}

export function useSetRecruitmentApprover() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (data: SetRecruitmentApproverPayload) => recruitmentApproverService.set(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [KEY] })
      toast.success('Đã lưu cấu hình người duyệt')
    },
    onError: () => toast.error('Lưu cấu hình thất bại'),
  })
}

export function useDeleteRecruitmentApprover() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (configId: string) => recruitmentApproverService.delete(configId),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [KEY] })
      toast.success('Đã xoá cấu hình người duyệt')
    },
    onError: () => toast.error('Xoá cấu hình thất bại'),
  })
}
