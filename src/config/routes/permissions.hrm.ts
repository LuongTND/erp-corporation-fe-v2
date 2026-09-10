import { P } from '../permissionCodes'

export const hrmPermissions: Record<string, string> = {
  // '/me' không cần permission — mọi nhân viên đã đăng nhập đều được xem hồ sơ mình
  '/store-manager': P.STORE_MANAGER_VIEW,
  '/recruitment/approver-configs': P.RECRUITMENT_APPROVER_VIEW,
  '/recruitment/interview-rules': P.INTERVIEW_RULE_CONFIGS_MANAGE,
  '/recruitment/candidates': P.RECRUITMENT_CANDIDATE_VIEW,
  '/recruitment/job-postings': P.RECRUITMENT_POSTING_MANAGE,
  '/recruitment': P.RECRUITMENT_REQUEST_VIEW,
}
