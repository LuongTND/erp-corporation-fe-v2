import { apiCall } from '@/lib/api'
import { API_ROUTES } from '@/config/api-routes'
import type { PermissionAuditLogFilter, PermissionAuditLogResponse, QueryResult } from '../types/admin.types'

export const auditLogsService = {
  list: (filter: PermissionAuditLogFilter = {}) =>
    apiCall.get<QueryResult<PermissionAuditLogResponse>>(API_ROUTES.AUDIT_LOGS.BASE, { params: filter }),
}
