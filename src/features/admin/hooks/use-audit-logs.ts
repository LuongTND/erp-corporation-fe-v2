import { useQuery } from '@tanstack/react-query'
import { auditLogsService } from '../services/audit-logs.service'
import type { PermissionAuditLogFilter } from '../types/admin.types'

const KEY = 'permission-audit-logs'

export function useAuditLogs(filter: PermissionAuditLogFilter) {
  return useQuery({
    queryKey: [KEY, filter],
    queryFn: () => auditLogsService.list(filter),
  })
}
