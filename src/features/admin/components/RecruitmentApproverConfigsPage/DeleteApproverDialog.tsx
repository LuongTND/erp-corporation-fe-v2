import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import type { RecruitmentApproverConfigResponse } from '../../types/admin.types'

interface DeleteApproverDialogProps {
  readonly target: RecruitmentApproverConfigResponse | null
  readonly onOpenChange: (open: boolean) => void
  readonly onConfirm: (id: string) => void
}

export function DeleteApproverDialog({ target, onOpenChange, onConfirm }: DeleteApproverDialogProps) {
  return (
    <AlertDialog open={!!target} onOpenChange={(open) => { if (!open) onOpenChange(false) }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xoá cấu hình?</AlertDialogTitle>
          <AlertDialogDescription>
            Người duyệt{' '}
            <span className="font-semibold text-foreground">"{target?.approverName}"</span>
            {target?.departmentName && (
              <> cho phòng <span className="font-semibold text-foreground">"{target.departmentName}"</span></>
            )}
            {' '}sẽ bị xoá.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => { onConfirm(target!.id) }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Xoá
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
