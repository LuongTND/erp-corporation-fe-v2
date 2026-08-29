import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { logger } from '@/lib/logger'
import { recruitmentService } from '../services/recruitment.service'
import type {
  RecruitmentRequestListParams,
  CreateRecruitmentRequestPayload,
  CreateCandidatePayload,
  EvaluateCandidatePayload,
  JobPostingListParams,
  CreateJobPostingPayload,
  CreateInterviewSchedulePayload,
  CompleteInterviewPayload,
} from '../types/recruitment.types'

const KEYS = {
  requests: (params?: RecruitmentRequestListParams) => ['recruitment-requests', params] as const,
  request: (id: string) => ['recruitment-request', id] as const,
  candidates: (params?: { requestId?: string; stage?: string }) => ['candidates', params] as const,
  candidate: (id: string) => ['candidate', id] as const,
  jobPostings: (params?: JobPostingListParams) => ['job-postings', params] as const,
  interviews: (candidateId: string) => ['candidate-interviews', candidateId] as const,
}

export function useRecruitmentRequests(params?: RecruitmentRequestListParams) {
  return useQuery({
    queryKey: KEYS.requests(params),
    queryFn: async () => {
      const res = await recruitmentService.getRequests(params)
      return res.data
    },
    staleTime: 30_000,
  })
}

export function useRecruitmentRequest(id: string) {
  return useQuery({
    queryKey: KEYS.request(id),
    queryFn: () => recruitmentService.getRequest(id),
    staleTime: 30_000,
    enabled: !!id,
  })
}

export function useCreateRecruitmentRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateRecruitmentRequestPayload) => recruitmentService.createRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recruitment-requests'] })
      toast.success('Tạo phiếu đề xuất thành công')
    },
    onError: (error) => {
      logger.error(error)
      toast.error('Không thể tạo phiếu đề xuất')
    },
  })
}

export function useSubmitRecruitmentRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => recruitmentService.submitRequest(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['recruitment-requests'] })
      queryClient.invalidateQueries({ queryKey: KEYS.request(id) })
      toast.success('Đã nộp phiếu chờ duyệt')
    },
    onError: (error) => {
      logger.error(error)
      toast.error('Không thể nộp phiếu')
    },
  })
}

export function useApproveRecruitmentRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, note }: { id: string; note?: string }) =>
      recruitmentService.approveRequest(id, note),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['recruitment-requests'] })
      queryClient.invalidateQueries({ queryKey: KEYS.request(id) })
      toast.success('Đã duyệt phiếu tuyển dụng')
    },
    onError: (error) => {
      logger.error(error)
      toast.error('Không thể duyệt phiếu')
    },
  })
}

export function useApproveLevel1RecruitmentRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, note }: { id: string; note?: string }) =>
      recruitmentService.approveLevel1Request(id, note),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['recruitment-requests'] })
      queryClient.invalidateQueries({ queryKey: KEYS.request(id) })
      toast.success('Đã duyệt cấp 1')
    },
    onError: (error) => {
      logger.error(error)
      toast.error('Không thể duyệt cấp 1')
    },
  })
}

export function useRejectRecruitmentRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, note }: { id: string; note: string }) =>
      recruitmentService.rejectRequest(id, note),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['recruitment-requests'] })
      queryClient.invalidateQueries({ queryKey: KEYS.request(id) })
      toast.success('Đã từ chối phiếu')
    },
    onError: (error) => {
      logger.error(error)
      toast.error('Không thể từ chối phiếu')
    },
  })
}

export function useRequestMoreInfo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, note }: { id: string; note: string }) =>
      recruitmentService.requestMoreInfo(id, note),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['recruitment-requests'] })
      queryClient.invalidateQueries({ queryKey: KEYS.request(id) })
      toast.success('Đã yêu cầu bổ sung thông tin')
    },
    onError: (error) => {
      logger.error(error)
      toast.error('Không thể gửi yêu cầu bổ sung')
    },
  })
}

export function useCandidates(params?: { requestId?: string; stage?: string }) {
  return useQuery({
    queryKey: KEYS.candidates(params),
    queryFn: async () => {
      const res = await recruitmentService.getCandidates(params)
      return res.data
    },
    staleTime: 30_000,
  })
}

export function useCandidate(id: string) {
  return useQuery({
    queryKey: KEYS.candidate(id),
    queryFn: () => recruitmentService.getCandidate(id),
    staleTime: 30_000,
    enabled: !!id,
  })
}

export function useCreateCandidate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateCandidatePayload) => recruitmentService.createCandidate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] })
      toast.success('Đã thêm ứng viên')
    },
    onError: (error) => {
      logger.error(error)
      toast.error('Không thể thêm ứng viên')
    },
  })
}

export function useEvaluateCandidate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: EvaluateCandidatePayload }) =>
      recruitmentService.evaluateCandidate(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: KEYS.candidate(id) })
      queryClient.invalidateQueries({ queryKey: ['candidates'] })
      toast.success('Đã lưu đánh giá ứng viên')
    },
    onError: (error) => {
      logger.error(error)
      toast.error('Không thể lưu đánh giá')
    },
  })
}

export function useHireCandidate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => recruitmentService.hireCandidate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] })
      toast.success('Đã tuyển dụng ứng viên')
    },
    onError: (error) => {
      logger.error(error)
      toast.error('Không thể tuyển dụng')
    },
  })
}

export function useRejectCandidate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, note }: { id: string; note?: string }) =>
      recruitmentService.rejectCandidate(id, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] })
      toast.success('Đã từ chối ứng viên')
    },
    onError: (error) => {
      logger.error(error)
      toast.error('Không thể từ chối ứng viên')
    },
  })
}

export function useScreenCandidate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => recruitmentService.screenCandidate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] })
      toast.success('Đã sơ loại ứng viên')
    },
    onError: (error) => {
      logger.error(error)
      toast.error('Không thể sơ loại')
    },
  })
}

export function useAssignCandidateToStore() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => recruitmentService.assignCandidateToStore(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] })
      toast.success('Đã chuyển sang PV cửa hàng')
    },
    onError: (error) => {
      logger.error(error)
      toast.error('Không thể chuyển ứng viên')
    },
  })
}

export function useAssignCandidateToProduction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => recruitmentService.assignToProduction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] })
      toast.success('Đã chuyển sang PV sản xuất')
    },
    onError: (error) => {
      logger.error(error)
      toast.error('Không thể chuyển ứng viên')
    },
  })
}

export function useJobPostings(params?: JobPostingListParams) {
  return useQuery({
    queryKey: KEYS.jobPostings(params),
    queryFn: async () => {
      const res = await recruitmentService.getJobPostings(params)
      return res.data
    },
    staleTime: 30_000,
  })
}

export function useCreateJobPosting() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateJobPostingPayload) => recruitmentService.createJobPosting(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-postings'] })
      toast.success('Đã tạo tin tuyển dụng')
    },
    onError: (error) => {
      logger.error(error)
      toast.error('Không thể tạo tin tuyển dụng')
    },
  })
}

export function useApprovePostingCost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => recruitmentService.approvePostingCost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-postings'] })
      toast.success('Đã duyệt chi phí')
    },
    onError: (error) => {
      logger.error(error)
      toast.error('Không thể duyệt chi phí')
    },
  })
}

export function useRejectPostingCost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, note }: { id: string; note?: string }) =>
      recruitmentService.rejectPostingCost(id, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-postings'] })
      toast.success('Đã từ chối chi phí')
    },
    onError: (error) => {
      logger.error(error)
      toast.error('Không thể từ chối chi phí')
    },
  })
}

export function useInterviewSchedules(candidateId: string) {
  return useQuery({
    queryKey: KEYS.interviews(candidateId),
    queryFn: () => recruitmentService.getInterviews(candidateId),
    staleTime: 30_000,
    enabled: !!candidateId,
  })
}

export function useCreateInterview(candidateId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateInterviewSchedulePayload) =>
      recruitmentService.createInterview(candidateId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.interviews(candidateId) })
      toast.success('Đã tạo lịch phỏng vấn')
    },
    onError: (error) => {
      logger.error(error)
      toast.error('Không thể tạo lịch phỏng vấn')
    },
  })
}

export function useCompleteInterview(candidateId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ scheduleId, data }: { scheduleId: string; data: CompleteInterviewPayload }) =>
      recruitmentService.completeInterview(candidateId, scheduleId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.interviews(candidateId) })
      toast.success('Đã cập nhật kết quả phỏng vấn')
    },
    onError: (error) => {
      logger.error(error)
      toast.error('Không thể cập nhật kết quả')
    },
  })
}

export function useCancelInterview(candidateId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ scheduleId, reason }: { scheduleId: string; reason?: string }) =>
      recruitmentService.cancelInterview(candidateId, scheduleId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.interviews(candidateId) })
      toast.success('Đã hủy lịch phỏng vấn')
    },
    onError: (error) => {
      logger.error(error)
      toast.error('Không thể hủy lịch')
    },
  })
}

export function useResolveInterviewRule(candidateId: string) {
  return useQuery({
    queryKey: ['interview-rule-resolve', candidateId],
    queryFn: () => recruitmentService.resolveInterviewRule(candidateId),
    staleTime: 60_000,
    enabled: !!candidateId,
  })
}
