import { apiCall } from '@/lib/api'
import type { PermissionAuditLogFilter, PermissionAuditLogResponse, QueryResult } from '../types/admin.types'

export const auditLogsService = {
  list: (filter: PermissionAuditLogFilter = {}) =>
    apiCall.get<QueryResult<PermissionAuditLogResponse>>('/api/audit-logs', { params: filter }),
}
