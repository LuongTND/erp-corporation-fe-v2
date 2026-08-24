import { Download, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { EmployeeDocumentResponse } from '../../../types/employee-document.types'
import { FileIcon } from './FileIcon'
import { formatBytes, formatDate } from './utils'

interface Props {
  doc: EmployeeDocumentResponse
  onDelete: () => void
}

export function DocCard({ doc, onDelete }: Props) {
  const handleDelete = () => {
    if (window.confirm(`Xóa "${doc.displayName}"? Thao tác không thể khôi phục.`)) onDelete()
  }
  return (
    <div className="flex flex-col rounded-xl border border-border bg-card p-4 gap-3">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
          <FileIcon contentType={doc.contentType} className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">{doc.displayName}</p>
          <p className="text-xs text-muted-foreground">{formatBytes(doc.fileSizeBytes)}</p>
        </div>
      </div>

      <div className="space-y-1 text-xs text-muted-foreground">
        {doc.issuedDate && <p>Ngày cấp: {formatDate(doc.issuedDate)}</p>}
        {doc.expiryDate && (
          <p className={doc.isExpired ? 'text-destructive' : doc.isExpiringSoon ? 'text-amber-600' : ''}>
            Hết hạn: {formatDate(doc.expiryDate)}
            {doc.isExpired && ' (đã hết hạn)'}
            {!doc.isExpired && doc.isExpiringSoon && ' (sắp hết hạn)'}
          </p>
        )}
        <p>Tải lên: {formatDate(doc.createdAt)}</p>
      </div>

      {doc.isExpired && (
        <Badge variant="outline" className="w-fit border-destructive/30 bg-destructive/10 text-xs font-normal text-destructive">
          Hết hạn
        </Badge>
      )}

      <div className="mt-auto flex gap-2 pt-1">
        <Button asChild variant="outline" size="sm" className="flex-1 h-8 text-xs">
          <a href={doc.fileUrl} download={doc.originalFileName} target="_blank" rel="noreferrer">
            <Download className="mr-1.5 h-3 w-3" />
            Tải về
          </a>
        </Button>
        <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive" onClick={handleDelete}>
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}
