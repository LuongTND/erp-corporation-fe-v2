import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { EmployeeDocumentResponse } from '../../../types/employee-document.types'

interface Props {
  doc: EmployeeDocumentResponse | null
  open: boolean
  onClose: () => void
}

function PreviewBody({ doc }: { doc: EmployeeDocumentResponse }) {
  if (doc.contentType.startsWith('image/')) {
    return (
      <div className="flex max-h-[75vh] items-center justify-center overflow-auto bg-muted/30 p-4">
        <img
          src={doc.fileUrl}
          alt={doc.displayName}
          className="max-h-[75vh] w-auto max-w-full rounded object-contain"
        />
      </div>
    )
  }

  if (doc.contentType === 'application/pdf') {
    return (
      <iframe
        src={doc.fileUrl}
        title={doc.displayName}
        className="h-[75vh] w-full border-0"
      />
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-muted-foreground text-sm">
      <p>Không thể xem trước loại tệp này.</p>
      <Button asChild variant="outline" size="sm">
        <a href={doc.fileUrl} download={doc.originalFileName} target="_blank" rel="noreferrer">
          <Download className="mr-1.5 h-3.5 w-3.5" />
          Tải về để xem
        </a>
      </Button>
    </div>
  )
}

export function DocumentPreviewDialog({ doc, open, onClose }: Props) {
  if (!doc) return null

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="flex w-[92vw] max-w-none sm:max-w-4xl flex-col gap-0 p-0">
        <DialogHeader className="px-5 py-4 border-b">
          <DialogTitle className="truncate pr-8 text-base">{doc.displayName}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          <PreviewBody doc={doc} />
        </div>
        <div className="flex justify-end px-5 py-3 border-t">
          <Button asChild variant="outline" size="sm">
            <a href={doc.fileUrl} download={doc.originalFileName} target="_blank" rel="noreferrer">
              <Download className="mr-1.5 h-3.5 w-3.5" />
              Tải về
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
