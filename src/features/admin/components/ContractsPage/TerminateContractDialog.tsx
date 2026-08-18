import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { EmploymentContractResponse } from '../../types/admin.types'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  contract: EmploymentContractResponse | null
  onConfirm: (terminationReason: string) => void
  isPending: boolean
}

export function TerminateContractDialog({ open, onOpenChange, contract, onConfirm, isPending }: Props) {
  const [reason, setReason] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!reason.trim()) return
    onConfirm(reason.trim())
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) setReason(''); onOpenChange(v) }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Chấm dứt hợp đồng</DialogTitle>
          {contract && (
            <p className="text-sm text-muted-foreground">
              Hợp đồng: <span className="font-mono font-medium">{contract.contractNumber}</span>
            </p>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="terminationReason">Lý do chấm dứt <span className="text-destructive">*</span></Label>
            <Textarea
              id="terminationReason"
              rows={3}
              placeholder="Nhập lý do chấm dứt hợp đồng..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              maxLength={500}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground text-right">{reason.length}/500</p>
          </div>

          <div className="flex gap-2 justify-end pt-1">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Hủy
            </Button>
            <Button type="submit" variant="destructive" disabled={isPending || !reason.trim()}>
              {isPending ? 'Đang xử lý...' : 'Chấm dứt hợp đồng'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
