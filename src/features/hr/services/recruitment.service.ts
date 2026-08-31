import { apiCall } from '@/lib/api'
import type { PaginatedResponse } from '@/types/api'
import type {
  RecruitmentRequestSummary,
  RecruitmentRequestDetail,
  CreateRecruitmentRequestPayload,
  RecruitmentRequestListParams,
  CandidateSummary,
  CandidateDetail,
  CreateCandidatePayload,
  EvaluateCandidatePayload,
  JobPostingSummary,
  CreateJobPostingPayload,
  JobPostingListParams,
  InterviewSchedule,
  CreateInterviewSchedulePayload,
  CompleteInterviewPayload,
  ResolvedInterviewRule,
} from '../types/recruitment.types'

const BASE = '/api/recruitment-requests'
const CANDIDATES = '/api/candidates'
const JOB_POSTINGS = '/api/job-postings'

export const recruitmentService = {
  getRequests: (params?: RecruitmentRequestListParams) =>
    apiCall.get<PaginatedResponse<RecruitmentRequestSummary>>(BASE, { params }),

  getRequest: (id: string) =>
    apiCall.get<RecruitmentRequestDetail>(`${BASE}/${id}`),

  createRequest: (data: CreateRecruitmentRequestPayload) =>
    apiCall.post<RecruitmentRequestDetail>(BASE, data),

  updateRequest: (id: string, data: Partial<CreateRecruitmentRequestPayload>) =>
    apiCall.put<void>(`${BASE}/${id}`, data),

  submitRequest: (id: string) =>
    apiCall.post<void>(`${BASE}/${id}/submit`),

  approveRequest: (id: string, note?: string) =>
    apiCall.post<void>(`${BASE}/${id}/approve`, { note }),

  approveLevel1Request: (id: string, note?: string) =>
    apiCall.post<void>(`${BASE}/${id}/approve-level1`, { note }),

  resolveInterviewRule: (candidateId: string) =>
    apiCall.get<ResolvedInterviewRule>(`/api/interview-rule-configs/resolve`, { params: { candidateId } }),

  rejectRequest: (id: string, note: string) =>
    apiCall.post<void>(`${BASE}/${id}/reject`, { note }),

  requestMoreInfo: (id: string, note: string) =>
    apiCall.post<void>(`${BASE}/${id}/request-more-info`, { note }),

  getCandidates: (params?: { requestId?: string; stage?: string }) =>
    apiCall.get<PaginatedResponse<CandidateSummary>>(CANDIDATES, { params }),

  getCandidate: (id: string) =>
    apiCall.get<CandidateDetail>(`${CANDIDATES}/${id}`),

  createCandidate: (data: CreateCandidatePayload) =>
    apiCall.post<CandidateDetail>(CANDIDATES, data),

  uploadCv: (id: string, file: File) => {
    const form = new FormData()
    form.append('file', file)
    return apiCall.post<void>(`${CANDIDATES}/${id}/cv`, form, {
      headers: { 'Content-Type': undefined },
    })
  },

  screenCandidate: (id: string) => apiCall.post<void>(`${CANDIDATES}/${id}/screen`),

  assignCandidateToStore: (id: string) => apiCall.post<void>(`${CANDIDATES}/${id}/assign-store`),

  assignToProduction: (id: string) => apiCall.post<void>(`${CANDIDATES}/${id}/assign-production`),

  evaluateCandidate: (id: string, data: EvaluateCandidatePayload) =>
    apiCall.post<void>(`${CANDIDATES}/${id}/evaluate`, data),

  rejectCandidate: (id: string, note?: string) =>
    apiCall.post<void>(`${CANDIDATES}/${id}/reject`, { note }),

  hireCandidate: (id: string, trialStartDate?: string) =>
    apiCall.post<void>(`${CANDIDATES}/${id}/hire`, { trialStartDate }),

  getJobPostings: (params?: JobPostingListParams) =>
    apiCall.get<PaginatedResponse<JobPostingSummary>>(JOB_POSTINGS, { params }),

  createJobPosting: (data: CreateJobPostingPayload) =>
    apiCall.post<JobPostingSummary>(JOB_POSTINGS, data),

  approvePostingCost: (id: string) =>
    apiCall.post<void>(`${JOB_POSTINGS}/${id}/approve-cost`),

  rejectPostingCost: (id: string, note?: string) =>
    apiCall.post<void>(`${JOB_POSTINGS}/${id}/reject-cost`, { note }),

  getInterviews: (candidateId: string) =>
    apiCall.get<InterviewSchedule[]>(`${CANDIDATES}/${candidateId}/interviews`),

  createInterview: (candidateId: string, data: CreateInterviewSchedulePayload) =>
    apiCall.post<InterviewSchedule>(`${CANDIDATES}/${candidateId}/interviews`, data),

  completeInterview: (candidateId: string, scheduleId: string, data: CompleteInterviewPayload) =>
    apiCall.post<void>(`${CANDIDATES}/${candidateId}/interviews/${scheduleId}/complete`, data),

  cancelInterview: (candidateId: string, scheduleId: string, reason?: string) =>
    apiCall.post<void>(`${CANDIDATES}/${candidateId}/interviews/${scheduleId}/cancel`, { reason }),
}
