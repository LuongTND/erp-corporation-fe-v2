import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { TriangleAlert } from 'lucide-react'
import type { RoleResponse } from '../../types/admin.types'

interface RoleDeleteDialogProps {
  role: RoleResponse | null
  onClose: () => void
  onDelete: (force?: boolean) => void
  isPending: boolean
}

export function RoleDeleteDialog({ role, onClose, onDelete, isPending }: RoleDeleteDialogProps) {
  const hasUsers = (role?.userCount ?? 0) > 0

  return (
    <AlertDialog open={!!role} onOpenChange={(open) => { if (!open) onClose() }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa vai trò</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3">
              <p>
                Xóa vai trò <span className="font-semibold text-foreground">"{role?.roleName}"</span>?
                Hành động này không thể hoàn tác.
              </p>
              {hasUsers && (
                <div className="flex items-start gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2.5 text-sm text-amber-600 dark:text-amber-400">
                  <TriangleAlert className="mt-0.5 size-4 shrink-0" />
                  <span>
                    Vai trò này đang được gán cho{' '}
                    <span className="font-semibold">{role?.userCount} người dùng</span>.
                    Chọn <span className="font-semibold">"Xóa luôn"</span> để gỡ tất cả và xóa vai trò.
                  </span>
                </div>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          {hasUsers ? (
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => onDelete(true)}
              disabled={isPending}
            >
              {isPending ? 'Đang xóa...' : 'Xóa luôn'}
            </AlertDialogAction>
          ) : (
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => onDelete()}
              disabled={isPending}
            >
              {isPending ? 'Đang xóa...' : 'Xóa'}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
