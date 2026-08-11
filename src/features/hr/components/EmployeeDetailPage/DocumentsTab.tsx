import { useState } from 'react'
import { FileText, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { EmployeeDocumentResponse, UploadDocumentPayload } from '../../types/employee-document.types'
import { DocCard, UploadDialog } from './Documents'

interface Props {
  docs: EmployeeDocumentResponse[]
  isLoading: boolean
  onUpload: (payload: UploadDocumentPayload, callbacks: { onSuccess: () => void }) => void
  onDelete: (id: string) => void
  isUploading: boolean
}

export function DocumentsTab({ docs, isLoading, onUpload, onDelete, isUploading }: Props) {
  const [uploadOpen, setUploadOpen] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{docs.length} tài liệu</p>
        <Button size="sm" onClick={() => setUploadOpen(true)}>
          <Plus className="w-4 h-4 mr-1.5" />
          Tải lên
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-44 rounded-xl" />)}
        </div>
      ) : docs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <FileText className="w-10 h-10 text-muted-foreground/40 mb-3" />
          <p className="text-sm text-muted-foreground">Chưa có tài liệu nào</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => setUploadOpen(true)}>
            <Plus className="w-4 h-4 mr-1.5" />
            Tải lên tài liệu đầu tiên
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {docs.map(doc => (
            <DocCard key={doc.id} doc={doc} onDelete={() => onDelete(doc.id)} />
          ))}
        </div>
      )}

      <UploadDialog open={uploadOpen} onClose={() => setUploadOpen(false)} onUpload={onUpload} isUploading={isUploading} />
    </div>
  )
}
