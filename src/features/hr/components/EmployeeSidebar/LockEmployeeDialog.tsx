import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface LockEmployeeDialogProps {
  readonly open: boolean
  readonly employeeName: string
  readonly onOpenChange: (open: boolean) => void
  readonly onConfirm: () => void
}

export function LockEmployeeDialog({ open, employeeName, onOpenChange, onConfirm }: LockEmployeeDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Khóa tài khoản?</AlertDialogTitle>
          <AlertDialogDescription>
            Nhân viên <strong>{employeeName}</strong> sẽ không thể đăng nhập sau khi bị khóa.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={onConfirm}
          >
            Khóa tài khoản
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
