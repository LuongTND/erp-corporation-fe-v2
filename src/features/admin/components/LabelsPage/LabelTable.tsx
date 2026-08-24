import { Pencil, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import type { LabelResponse } from '../../types/admin.types'

interface LabelTableProps {
  readonly labels: LabelResponse[]
  readonly onEdit: (label: LabelResponse) => void
  readonly onDelete: (label: LabelResponse) => void
  readonly onToggleActive: (label: LabelResponse) => void
}

export function LabelTable({ labels, onEdit, onDelete, onToggleActive }: LabelTableProps) {
  if (labels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
        <p className="text-sm">Chưa có nhãn nào</p>
        <p className="text-xs">Tạo nhãn để phân loại nhân viên</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Nhãn</th>
            <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Màu</th>
            <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Trạng thái</th>
            <th className="px-4 py-2.5" />
          </tr>
        </thead>
        <tbody>
          {labels.map((label) => (
            <tr key={label.id} className="border-b border-border/60 last:border-0 hover:bg-muted/30 transition-colors">
              <td className="px-4 py-3">
                <Badge
                  style={{ backgroundColor: `${label.color}22`, color: label.color, borderColor: `${label.color}44` }}
                  className="border text-xs font-medium"
                >
                  {label.name}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <span
                    className="w-4 h-4 rounded-full border border-border/50 flex-shrink-0"
                    style={{ backgroundColor: label.color }}
                  />
                  <span className="font-mono text-xs text-muted-foreground">{label.color}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <Switch
                  checked={label.isActive}
                  onCheckedChange={() => onToggleActive(label)}
                  aria-label={label.isActive ? 'Đang hoạt động' : 'Đã tắt'}
                />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
                    onClick={() => onEdit(label)}
                    aria-label="Chỉnh sửa"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive cursor-pointer"
                    onClick={() => onDelete(label)}
                    aria-label="Xóa"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
