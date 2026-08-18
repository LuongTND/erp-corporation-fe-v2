import { useState } from 'react'
import { Plus } from 'lucide-react'
import { HRPageHeader } from '@/features/hr/components/HRPageHeader'
import { Button } from '@/components/ui/button'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { useContractTemplates, useUploadContractTemplate, useDownloadContractTemplate, useDeleteContractTemplate } from '../hooks/use-contracts'
import { ContractTemplateTable, UploadTemplateSheet } from '../components/ContractTemplatesPage'
import type { ContractTemplateResponse } from '../types/admin.types'
import type { UploadTemplateFormValues } from '../schemas/contract-template.schema'

export default function ContractTemplatesPage() {
  const [uploadOpen, setUploadOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<ContractTemplateResponse | null>(null)

  const { data: templates = [], isLoading } = useContractTemplates()
  const uploadTemplate = useUploadContractTemplate()
  const downloadTemplate = useDownloadContractTemplate()
  const deleteTemplate = useDeleteContractTemplate()

  async function handleUpload(values: UploadTemplateFormValues, file: File) {
    await uploadTemplate.mutateAsync({ name: values.name, description: values.description, file })
    setUploadOpen(false)
  }

  return (
    <div className="h-full flex flex-col bg-background text-foreground">
      <HRPageHeader
        breadcrumbs={[{ label: 'Admin' }, { label: 'Hợp đồng' }, { label: 'Mẫu hợp đồng', isActive: true }]}
      />

      <div className="flex flex-col flex-1 min-h-0 max-w-7xl w-full mx-auto px-4 md:px-8 py-5 gap-4">
        <div className="flex items-start justify-between gap-4 shrink-0">
          <div>
            <h1 className="text-xl font-semibold">Mẫu hợp đồng</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Quản lý các biểu mẫu hợp đồng dùng chung cho toàn hệ thống
            </p>
          </div>
          <Button onClick={() => setUploadOpen(true)} size="sm" className="gap-1.5 shrink-0 cursor-pointer">
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            Thêm mẫu
          </Button>
        </div>

        <ContractTemplateTable
          templates={templates}
          isLoading={isLoading}
          isDownloading={downloadTemplate.isPending}
          onDownload={(template) => downloadTemplate.mutate({ id: template.id, fileName: template.originalFileName })}
          onDelete={setDeleteTarget}
        />
      </div>

      <UploadTemplateSheet
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onSubmit={handleUpload}
        isPending={uploadTemplate.isPending}
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xoá mẫu hợp đồng?</AlertDialogTitle>
            <AlertDialogDescription>
              Mẫu <strong>{deleteTarget?.name}</strong> sẽ bị xoá vĩnh viễn khỏi hệ thống và Azure Blob. Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">Huỷ</AlertDialogCancel>
            <AlertDialogAction
              className="cursor-pointer bg-destructive hover:bg-destructive/90"
              onClick={async () => {
                if (deleteTarget) {
                  await deleteTemplate.mutateAsync(deleteTarget.id)
                  setDeleteTarget(null)
                }
              }}
            >
              {deleteTemplate.isPending ? 'Đang xoá...' : 'Xoá'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
