export type RecruitmentRequestStatus = 'Draft' | 'Submitted' | 'Approved' | 'Rejected' | 'NeedMoreInfo'
export type RecruitmentContext = 'Store' | 'Production'
export type CandidateStage = 'New' | 'Screening' | 'StoreInterview' | 'ProductionInterview' | 'Offer' | 'Hired' | 'Rejected'

export const RECRUITMENT_STATUS_LABELS: Record<RecruitmentRequestStatus, string> = {
  Draft: 'Nháp',
  Submitted: 'Chờ duyệt',
  Approved: 'Đã duyệt',
  Rejected: 'Từ chối',
  NeedMoreInfo: 'Cần bổ sung',
}

export const CANDIDATE_STAGE_LABELS: Record<CandidateStage, string> = {
  New: 'Mới',
  Screening: 'Sơ loại',
  StoreInterview: 'PV cửa hàng',
  ProductionInterview: 'PV sản xuất',
  Offer: 'Đề nghị',
  Hired: 'Đã tuyển',
  Rejected: 'Từ chối',
}

export interface RecruitmentRequestSummary {
  id: string
  code: string
  context: RecruitmentContext
  storeId?: string
  storeName?: string
  departmentId?: string
  departmentName?: string
  jobPositionId: string
  jobPositionName: string
  quantity: number
  reason?: string
  status: RecruitmentRequestStatus
  submittedAt?: string
  approvedAt?: string
  createdAt: string
  createdByName: string
  candidateCount: number
}

export interface RecruitmentRequestDetail extends RecruitmentRequestSummary {
  approverNote?: string
  approvalHistory: ApprovalHistoryItem[]
  jobPostings: JobPostingSummary[]
}

export interface ApprovalHistoryItem {
  id: string
  action: string
  actorName: string
  note?: string
  occurredAt: string
}

export type CandidateSourceChannel = 'Facebook' | 'Referral' | 'PaidBoard' | 'WalkIn' | 'Internal' | 'Other'
export type JobPostingChannel = 'Facebook' | 'PaidBoard'
export type JobPostingCostStatus = 'NotRequired' | 'PendingApproval' | 'Approved' | 'Rejected'

export const SOURCE_CHANNEL_LABELS: Record<CandidateSourceChannel, string> = {
  Facebook: 'Facebook',
  Referral: 'Giới thiệu',
  PaidBoard: 'Kênh phí',
  WalkIn: 'Nộp trực tiếp',
  Internal: 'Nội bộ',
  Other: 'Khác',
}

export const COST_STATUS_LABELS: Record<JobPostingCostStatus, string> = {
  NotRequired: 'Không cần duyệt',
  PendingApproval: 'Chờ duyệt CP',
  Approved: 'Đã duyệt CP',
  Rejected: 'Từ chối CP',
}

export interface JobPostingSummary {
  id: string
  recruitmentRequestId: string
  requestCode: string
  title: string
  channel: JobPostingChannel
  estimatedCost?: number
  costStatus: JobPostingCostStatus
  createdAt: string
}

export interface CreateJobPostingPayload {
  recruitmentRequestId: string
  title: string
  channel: JobPostingChannel
  estimatedCost?: number
}

export interface JobPostingListParams {
  costStatus?: JobPostingCostStatus
  channel?: JobPostingChannel
}

export interface CreateRecruitmentRequestPayload {
  context: RecruitmentContext
  storeId?: string
  departmentId?: string
  jobPositionId: string
  quantity: number
  reason?: string
}

export interface RecruitmentRequestListParams {
  status?: RecruitmentRequestStatus
  context?: RecruitmentContext
  departmentId?: string
  storeId?: string
}

export interface CandidateSummary {
  id: string
  fullName: string
  phone?: string
  email?: string
  cvUrl?: string
  sourceChannel?: CandidateSourceChannel
  stage: CandidateStage
  requestId: string
  requestCode: string
  createdAt: string
  evaluationScore?: number
  evaluationRecommendation?: string
}

export interface CandidateDetail extends CandidateSummary {
  evaluations: CandidateEvaluation[]
}

export interface CandidateEvaluation {
  id: string
  evaluatorName: string
  score: number
  recommendation: string
  note?: string
  evaluatedAt: string
}

export interface CreateCandidatePayload {
  requestId: string
  fullName: string
  phone?: string
  email?: string
}

export interface EvaluateCandidatePayload {
  score: number
  recommendation: string
  note?: string
}
