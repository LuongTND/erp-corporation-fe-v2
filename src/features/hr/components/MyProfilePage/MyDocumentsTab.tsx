import { useState } from 'react'
import { FileText, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuthStore } from '@/stores/auth.store'
import { useMyDocuments, useUploadMyDocument, useDeleteMyDocument } from '../../hooks/use-my-documents'
import { DocCard } from '../EmployeeDetailPage/Documents/DocCard'
import { UploadDialog } from '../EmployeeDetailPage/Documents/UploadDialog'
import { EMPLOYEE_ALLOWED_CATEGORIES, type UploadDocumentPayload } from '../../types/employee-document.types'

export function MyDocumentsTab() {
  const [uploadOpen, setUploadOpen] = useState(false)
  const myId = useAuthStore(s => s.user?.id)

  const { data: docs = [], isLoading } = useMyDocuments()
  const { mutate: upload, isPending: isUploading } = useUploadMyDocument()
  const { mutate: remove } = useDeleteMyDocument()

  const handleUpload = (payload: UploadDocumentPayload, callbacks: { onSuccess: () => void }) => {
    upload(payload, { onSuccess: callbacks.onSuccess })
  }

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
            <DocCard
              key={doc.id}
              doc={doc}
              onDelete={() => remove(doc.id)}
              canDelete={doc.uploadedById === myId}
            />
          ))}
        </div>
      )}

      <UploadDialog
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUpload={handleUpload}
        isUploading={isUploading}
        allowedCategories={EMPLOYEE_ALLOWED_CATEGORIES}
      />
    </div>
  )
}
