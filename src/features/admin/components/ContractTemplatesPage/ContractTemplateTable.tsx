import { Download, Eye, FileText, Trash2 } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import type { ContractTemplateResponse } from '../../types/admin.types'

interface Props {
  templates: ContractTemplateResponse[]
  isLoading: boolean
  isDownloading: boolean
  onDownload: (template: ContractTemplateResponse) => void
  onDelete: (template: ContractTemplateResponse) => void
}

export function ContractTemplateTable({ templates, isLoading, isDownloading, onDownload, onDelete }: Props) {
  if (isLoading) {
    return (
      <div className="rounded-lg border bg-card overflow-auto max-h-full min-h-0">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-card">
            <TableRow>
              <TableHead>Tên mẫu</TableHead>
              <TableHead>File gốc</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 4 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: 5 }).map((__, j) => (
                  <TableCell key={j}><Skeleton className="h-4 w-24" /></TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  if (templates.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 text-muted-foreground py-16">
        <FileText className="h-10 w-10 opacity-30" aria-hidden="true" />
        <p className="text-sm">Chưa có mẫu hợp đồng nào. Tải lên mẫu đầu tiên.</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border bg-card overflow-auto max-h-full min-h-0">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-card">
          <TableRow>
            <TableHead>Tên mẫu</TableHead>
            <TableHead>File gốc</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Ngày tạo</TableHead>
            <TableHead className="w-32" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {templates.map((template) => (
            <TableRow key={template.id} className="hover:bg-muted/40 transition-colors duration-150">
              <TableCell>
                <div>
                  <p className="font-medium text-sm">{template.name}</p>
                  {template.description && (
                    <p className="text-xs text-muted-foreground mt-0.5">{template.description}</p>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">{template.originalFileName}</TableCell>
              <TableCell>
                <Badge variant={template.isActive ? 'default' : 'outline'}>
                  {template.isActive ? 'Đang dùng' : 'Tắt'}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {new Date(template.createdAt).toLocaleDateString('vi-VN')}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 justify-end">
                  {template.fileUrl && (
                    <a
                      href={template.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Xem trước"
                      aria-label={`Xem trước ${template.name}`}
                      className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-muted transition-colors duration-150 cursor-pointer"
                    >
                      <Eye className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                    </a>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 cursor-pointer"
                    onClick={() => onDownload(template)}
                    disabled={isDownloading}
                    aria-label={`Tải về ${template.name}`}
                    title="Tải về"
                  >
                    <Download className="h-3.5 w-3.5" aria-hidden="true" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 cursor-pointer text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => onDelete(template)}
                    aria-label={`Xoá mẫu ${template.name}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
