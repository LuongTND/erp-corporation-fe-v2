import { useRef } from 'react'
import { ScanLine } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import type { EmploymentContractResponse } from '../../types/admin.types'

interface Props {
  contract: EmploymentContractResponse | null
  onOpenChange: (open: boolean) => void
  onUpload: (contractId: string, file: File) => Promise<void>
  isPending: boolean
}

export function UploadScanDialog({ contract, onOpenChange, onUpload, isPending }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleSubmit() {
    const file = fileRef.current?.files?.[0]
    if (!file || !contract) return
    await onUpload(contract.id, file)
    if (fileRef.current) fileRef.current.value = ''
    onOpenChange(false)
  }

  return (
    <Dialog open={!!contract} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-md data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-bottom-4 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-bottom-2 animation-duration-250"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ScanLine className="h-4 w-4" aria-hidden="true" />
            Upload bản scan đã ký — {contract?.contractNumber}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-3">
          <p className="text-sm text-muted-foreground">
            Sau khi các bên đã ký và đóng dấu, scan hợp đồng thành PDF và tải lên.
            Hệ thống sẽ chuyển trạng thái hợp đồng sang <strong>Đang hiệu lực</strong>.
          </p>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="scan-file">File scan (PDF) <span className="text-destructive">*</span></Label>
            <input
              id="scan-file"
              type="file"
              accept=".pdf,image/*"
              ref={fileRef}
              className="text-sm file:mr-3 file:rounded file:border-0 file:bg-muted file:px-3 file:py-1.5 file:text-xs file:font-medium file:cursor-pointer cursor-pointer"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending} className="cursor-pointer">
            Huỷ
          </Button>
          <Button onClick={handleSubmit} disabled={isPending} className="cursor-pointer">
            {isPending ? 'Đang tải...' : 'Upload & Kích hoạt'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
