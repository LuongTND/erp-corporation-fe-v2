export type RecruitmentRequestStatus = 'Draft' | 'Submitted' | 'PendingLevel1Approval' | 'PendingLevel2Approval' | 'Approved' | 'Rejected' | 'NeedMoreInfo' | 'Cancelled'
export type RecruitmentContext = 'Store' | 'Department'
export type CandidateStage = 'New' | 'Screening' | 'StoreInterview' | 'ProductionInterview' | 'Offer' | 'Hired' | 'Rejected'

export const RECRUITMENT_STATUS_LABELS: Record<RecruitmentRequestStatus, string> = {
  Draft: 'Nháp',
  Submitted: 'Đã nộp',
  PendingLevel1Approval: 'Chờ duyệt L1',
  PendingLevel2Approval: 'Chờ duyệt L2',
  Approved: 'Đã duyệt',
  Rejected: 'Từ chối',
  NeedMoreInfo: 'Cần bổ sung',
  Cancelled: 'Đã hủy',
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
  requestCode: string
  requestContext: RecruitmentContext
  storeId?: string
  storeName?: string
  departmentId?: string
  departmentName?: string
  positionTitle: string
  headcount: number
  reason: string
  status: RecruitmentRequestStatus
  requestedByUserId: string
  requestedByName: string
  createdAt: string
}

export interface RecruitmentRequestDetail extends RecruitmentRequestSummary {
  rejectionNote?: string
  needMoreInfoNote?: string
  jobPostings: JobPostingSummary[]
  workflowInstanceId?: string
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
  requestCode?: string
  title: string
  channel: JobPostingChannel
  postUrl?: string
  estimatedCost?: number
  costStatus: JobPostingCostStatus
  costApprovedByName?: string
  costRejectionNote?: string
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
  recruitmentRequestId?: string
}

export interface CreateRecruitmentRequestPayload {
  requestContext: RecruitmentContext
  storeId?: string
  departmentId?: string
  positionTitle: string
  headcount: number
  reason: string
  jobDescription?: string
  requiredByDate?: string
}

export interface RecruitmentRequestListParams {
  status?: RecruitmentRequestStatus
  requestContext?: RecruitmentContext
  departmentId?: string
  storeId?: string
  requestedByUserId?: string
}

export interface CandidateSummary {
  id: string
  fullName: string
  phone?: string
  email?: string
  cvUrl?: string
  sourceChannel?: CandidateSourceChannel
  stage: CandidateStage
  recruitmentRequestId?: string
  requestCode?: string
  rejectionReason?: string
  createdAt: string
  evaluationScore?: number
  evaluationRecommendation?: string
}

export interface CandidateDetail extends CandidateSummary {
  notes?: string
  convertedEmployeeId?: string
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

export type InterviewScheduleStatus = 'Scheduled' | 'Completed' | 'Cancelled' | 'NoShow'
export type InterviewLocation = 'AtStore' | 'AtOffice' | 'AtFactory' | 'Remote'

export const INTERVIEW_LOCATION_LABELS: Record<InterviewLocation, string> = {
  AtStore: 'Tại cửa hàng',
  AtOffice: 'Tại văn phòng',
  AtFactory: 'Tại xưởng',
  Remote: 'Trực tuyến',
}

export const INTERVIEW_STATUS_LABELS: Record<InterviewScheduleStatus, string> = {
  Scheduled: 'Đã hẹn',
  Completed: 'Hoàn thành',
  Cancelled: 'Đã hủy',
  NoShow: 'Không đến',
}

export interface InterviewSchedule {
  id: string
  interviewerId: string
  interviewerName: string
  scheduledAt: string
  location: InterviewLocation
  locationNote?: string
  notes?: string
  status: InterviewScheduleStatus
  interviewResult?: string
  createdAt: string
}

export interface CreateInterviewSchedulePayload {
  interviewerId: string
  scheduledAt: string
  location: InterviewLocation
  locationNote?: string
  notes?: string
}

export interface CompleteInterviewPayload {
  interviewResult: string
}

export interface ResolvedInterviewRule {
  id: string
  interviewerRoleKey: string
  location: InterviewLocation
  schedulerRoleKey?: string
  notifyRoleKey?: string
}
