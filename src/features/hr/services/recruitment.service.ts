import { apiCall } from '@/lib/api'
import { API_ROUTES } from '@/config/api-routes'
import type { QueryResult } from '@/types/api'
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

export const recruitmentService = {
  getRequests: (params?: RecruitmentRequestListParams) =>
    apiCall.get<QueryResult<RecruitmentRequestSummary>>(API_ROUTES.RECRUITMENT_REQUESTS.BASE, { params }),

  getRequest: (id: string) =>
    apiCall.get<RecruitmentRequestDetail>(API_ROUTES.RECRUITMENT_REQUESTS.GET_BY_ID(id)),

  createRequest: (data: CreateRecruitmentRequestPayload) =>
    apiCall.post<RecruitmentRequestDetail>(API_ROUTES.RECRUITMENT_REQUESTS.BASE, data),

  updateRequest: (id: string, data: Partial<CreateRecruitmentRequestPayload>) =>
    apiCall.put<void>(API_ROUTES.RECRUITMENT_REQUESTS.GET_BY_ID(id), data),

  submitRequest: (id: string) =>
    apiCall.post<void>(API_ROUTES.RECRUITMENT_REQUESTS.SUBMIT(id)),

  approveRequest: (id: string, note?: string) =>
    apiCall.post<void>(API_ROUTES.RECRUITMENT_REQUESTS.APPROVE(id), { note }),

  approveLevel1Request: (id: string, note?: string) =>
    apiCall.post<void>(API_ROUTES.RECRUITMENT_REQUESTS.APPROVE_LEVEL1(id), { note }),

  resolveInterviewRule: (candidateId: string) =>
    apiCall.get<ResolvedInterviewRule>(API_ROUTES.INTERVIEW_RULE_CONFIGS.RESOLVE, { params: { candidateId } }),

  rejectRequest: (id: string, note: string) =>
    apiCall.post<void>(API_ROUTES.RECRUITMENT_REQUESTS.REJECT(id), { note }),

  requestMoreInfo: (id: string, note: string) =>
    apiCall.post<void>(API_ROUTES.RECRUITMENT_REQUESTS.REQUEST_MORE_INFO(id), { note }),

  getCandidates: (params?: { requestId?: string; stage?: string }) =>
    apiCall.get<PaginatedResponse<CandidateSummary>>(API_ROUTES.CANDIDATES.BASE, { params }),

  getCandidate: (id: string) =>
    apiCall.get<CandidateDetail>(API_ROUTES.CANDIDATES.GET_BY_ID(id)),

  createCandidate: (data: CreateCandidatePayload) =>
    apiCall.post<CandidateDetail>(API_ROUTES.CANDIDATES.BASE, data),

  uploadCv: (id: string, file: File) => {
    const form = new FormData()
    form.append('file', file)
    return apiCall.post<void>(API_ROUTES.CANDIDATES.CV(id), form, {
      headers: { 'Content-Type': undefined },
    })
  },

  screenCandidate: (id: string) => apiCall.post<void>(API_ROUTES.CANDIDATES.SCREEN(id)),

  assignCandidateToStore: (id: string) => apiCall.post<void>(API_ROUTES.CANDIDATES.ASSIGN_STORE(id)),

  assignToProduction: (id: string) => apiCall.post<void>(API_ROUTES.CANDIDATES.ASSIGN_PRODUCTION(id)),

  evaluateCandidate: (id: string, data: EvaluateCandidatePayload) =>
    apiCall.post<void>(API_ROUTES.CANDIDATES.EVALUATE(id), data),

  rejectCandidate: (id: string, note?: string) =>
    apiCall.post<void>(API_ROUTES.CANDIDATES.REJECT(id), { note }),

  hireCandidate: (id: string, trialStartDate?: string) =>
    apiCall.post<void>(API_ROUTES.CANDIDATES.HIRE(id), { trialStartDate }),

  getJobPostings: (params?: JobPostingListParams) =>
    apiCall.get<PaginatedResponse<JobPostingSummary>>(API_ROUTES.JOB_POSTINGS.BASE, { params }),

  createJobPosting: (data: CreateJobPostingPayload) =>
    apiCall.post<JobPostingSummary>(API_ROUTES.JOB_POSTINGS.BASE, data),

  approvePostingCost: (id: string) =>
    apiCall.post<void>(API_ROUTES.JOB_POSTINGS.APPROVE_COST(id)),

  rejectPostingCost: (id: string, note?: string) =>
    apiCall.post<void>(API_ROUTES.JOB_POSTINGS.REJECT_COST(id), { note }),

  getInterviews: (candidateId: string) =>
    apiCall.get<InterviewSchedule[]>(API_ROUTES.CANDIDATES.INTERVIEWS(candidateId)),

  createInterview: (candidateId: string, data: CreateInterviewSchedulePayload) =>
    apiCall.post<InterviewSchedule>(API_ROUTES.CANDIDATES.INTERVIEWS(candidateId), data),

  completeInterview: (candidateId: string, scheduleId: string, data: CompleteInterviewPayload) =>
    apiCall.post<void>(API_ROUTES.CANDIDATES.INTERVIEW_COMPLETE(candidateId, scheduleId), data),

  cancelInterview: (candidateId: string, scheduleId: string, reason?: string) =>
    apiCall.post<void>(API_ROUTES.CANDIDATES.INTERVIEW_CANCEL(candidateId, scheduleId), { reason }),
}
