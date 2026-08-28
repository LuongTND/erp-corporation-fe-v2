import { P } from '../permissionCodes'

export const hrmPermissions: Record<string, string> = {
  // '/me' không cần permission — mọi nhân viên đã đăng nhập đều được xem hồ sơ mình
  '/store-manager': P.STORE_MANAGER_VIEW,
  '/hr/recruitment': P.RECRUITMENT_REQUEST_VIEW,
  '/hr/recruitment/:id': P.RECRUITMENT_REQUEST_VIEW,
  '/hr/candidates': P.RECRUITMENT_CANDIDATE_VIEW,
  '/hr/job-postings': P.RECRUITMENT_POSTING_MANAGE,
}
