import { useState } from 'react'
import { Download, Eye, EyeOff, ScanSearch, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import type { EmployeeDocumentResponse } from '../../../types/employee-document.types'
import { FileIcon } from './FileIcon'
import { formatBytes, formatDate } from './utils'
import { DocumentPreviewDialog } from './DocumentPreviewDialog'

interface Props {
  doc: EmployeeDocumentResponse
  onDelete: () => void
  canDelete?: boolean
  onToggleVisibility?: (isVisible: boolean) => void
}

export function DocCard({ doc, onDelete, canDelete = true, onToggleVisibility }: Props) {
  const [previewOpen, setPreviewOpen] = useState(false)

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

      <div className="flex flex-wrap gap-1.5">
        {doc.isExpired && (
          <Badge variant="outline" className="border-destructive/30 bg-destructive/10 text-xs font-normal text-destructive">
            Hết hạn
          </Badge>
        )}
        {onToggleVisibility && (
          <Badge
            variant="outline"
            className={doc.isVisibleToEmployee
              ? 'border-emerald-500/30 bg-emerald-500/10 text-xs font-normal text-emerald-600'
              : 'border-border text-xs font-normal text-muted-foreground'}
          >
            {doc.isVisibleToEmployee ? 'Hiển thị với NV' : 'Ẩn với NV'}
          </Badge>
        )}
      </div>

      <div className="mt-auto flex gap-2 pt-1">
        <Button variant="outline" size="sm" className="flex-1 h-8 text-xs" onClick={() => setPreviewOpen(true)}>
          <ScanSearch className="mr-1.5 h-3 w-3" />
          Xem
        </Button>
        <Button asChild variant="outline" size="sm" className="h-8 w-8 p-0">
          <a href={doc.fileUrl} download={doc.originalFileName} target="_blank" rel="noreferrer">
            <Download className="h-3 w-3" />
          </a>
        </Button>
        {onToggleVisibility && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => onToggleVisibility(!doc.isVisibleToEmployee)}
              >
                {doc.isVisibleToEmployee ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{doc.isVisibleToEmployee ? 'Ẩn với nhân viên' : 'Hiện với nhân viên'}</TooltipContent>
          </Tooltip>
        )}
        {canDelete && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                <Trash2 className="h-3 w-3" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Xóa tài liệu</AlertDialogTitle>
                <AlertDialogDescription>
                  Xóa <span className="font-medium text-foreground">"{doc.displayName}"</span>? Thao tác không thể khôi phục.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-white hover:bg-destructive/90"
                  onClick={onDelete}
                >
                  Xóa
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      <DocumentPreviewDialog doc={doc} open={previewOpen} onClose={() => setPreviewOpen(false)} />
    </div>
  )
}
