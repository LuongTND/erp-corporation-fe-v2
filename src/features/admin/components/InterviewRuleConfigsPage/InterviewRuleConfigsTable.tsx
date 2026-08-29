import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Pencil } from 'lucide-react'
import type { InterviewRuleConfigResponse } from '../../types/admin.types'
import { INTERVIEW_RULE_LOCATION_LABELS } from '../../types/admin.types'
import { InterviewRuleContextBadge } from './InterviewRuleContextBadge'

interface Props {
  configs: InterviewRuleConfigResponse[]
  canManage: boolean
  onEdit: (config: InterviewRuleConfigResponse) => void
}

export function InterviewRuleConfigsTable({ configs, canManage, onEdit }: Props) {
  return (
    <div className="rounded-md border overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên rule</TableHead>
            <TableHead>Ngữ cảnh</TableHead>
            <TableHead>Địa điểm</TableHead>
            <TableHead>Role phỏng vấn</TableHead>
            <TableHead className="text-center">Ưu tiên</TableHead>
            <TableHead className="text-center">Trạng thái</TableHead>
            {canManage && <TableHead className="w-16" />}
          </TableRow>
        </TableHeader>
        <TableBody>
          {configs.length === 0 && (
            <TableRow>
              <TableCell colSpan={canManage ? 7 : 6} className="text-center text-muted-foreground py-10">
                Chưa có rule nào
              </TableCell>
            </TableRow>
          )}
          {configs.map(cfg => (
            <TableRow key={cfg.id}>
              <TableCell className="font-medium">{cfg.name}</TableCell>
              <TableCell>
                <InterviewRuleContextBadge context={cfg.context} />
              </TableCell>
              <TableCell>{INTERVIEW_RULE_LOCATION_LABELS[cfg.location]}</TableCell>
              <TableCell className="font-mono text-sm">{cfg.interviewerRoleKey}</TableCell>
              <TableCell className="text-center">{cfg.priority}</TableCell>
              <TableCell className="text-center">
                <Badge variant={cfg.isActive ? 'default' : 'secondary'}>
                  {cfg.isActive ? 'Hoạt động' : 'Tắt'}
                </Badge>
              </TableCell>
              {canManage && (
                <TableCell>
                  <Button size="icon" variant="ghost" onClick={() => onEdit(cfg)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
