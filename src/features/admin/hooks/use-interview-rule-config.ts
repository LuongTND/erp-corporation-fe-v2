import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { logger } from '@/lib/logger'
import { interviewRuleConfigService } from '../services/interview-rule-config.service'
import type {
  CreateInterviewRuleConfigPayload,
  UpdateInterviewRuleConfigPayload,
  InterviewRuleConfigListParams,
} from '../types/admin.types'

const KEYS = {
  all: (params?: InterviewRuleConfigListParams) => ['interview-rule-configs', params] as const,
}

export function useInterviewRuleConfigs(params?: InterviewRuleConfigListParams) {
  return useQuery({
    queryKey: KEYS.all(params),
    queryFn: () => interviewRuleConfigService.getAll(params),
    staleTime: 60_000,
  })
}

export function useCreateInterviewRuleConfig() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateInterviewRuleConfigPayload) => interviewRuleConfigService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interview-rule-configs'] })
      toast.success('Đã tạo rule phỏng vấn')
    },
    onError: (error) => {
      logger.error(error)
      toast.error('Không thể tạo rule')
    },
  })
}

export function useUpdateInterviewRuleConfig() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateInterviewRuleConfigPayload }) =>
      interviewRuleConfigService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interview-rule-configs'] })
      toast.success('Đã cập nhật rule')
    },
    onError: (error) => {
      logger.error(error)
      toast.error('Không thể cập nhật rule')
    },
  })
}

export function useResolveInterviewRule(candidateId: string) {
  return useQuery({
    queryKey: ['interview-rule-resolve', candidateId],
    queryFn: () => interviewRuleConfigService.resolve(candidateId),
    staleTime: 60_000,
    enabled: !!candidateId,
  })
}
