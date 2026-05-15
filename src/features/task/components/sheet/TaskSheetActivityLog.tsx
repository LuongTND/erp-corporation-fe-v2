import { useEffect, useState } from 'react'
import { Clock, User } from 'lucide-react'
import type { ActivityEntry } from '../../types/task.types'
import { taskActivityService } from '../../mocks/task.mock'

const C = {
  text: '#141413',
  muted: '#8e8b82',
  border: '#e6dfd8',
  accent: '#cc785c',
  bgHover: '#f5f0e8',
} as const

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'vừa xong'
  if (m < 60) return `${m} phút trước`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} giờ trước`
  const d = Math.floor(h / 24)
  if (d < 7) return `${d} ngày trước`
  return new Date(iso).toLocaleDateString('vi-VN')
}

function actionLabel(entry: ActivityEntry): string {
  const { action, meta } = entry
  switch (action) {
    case 'created':           return 'đã tạo task này'
    case 'title_changed':     return `đã đổi tiêu đề${meta?.to ? ` thành "${meta.to}"` : ''}`
    case 'status_changed':    return `đã chuyển trạng thái${meta?.from ? ` từ "${meta.from}"` : ''}${meta?.to ? ` sang "${meta.to}"` : ''}`
    case 'priority_changed':  return `đã đổi độ ưu tiên${meta?.from ? ` từ "${meta.from}"` : ''}${meta?.to ? ` sang "${meta.to}"` : ''}`
    case 'description_changed': return 'đã cập nhật mô tả'
    case 'assignee_changed':  return `đã phân công${meta?.to ? ` cho "${meta.to}"` : ''}`
    case 'due_date_changed':  return `đã cập nhật hạn hoàn thành${meta?.to ? ` thành ${meta.to}` : ''}`
    case 'comment_added':     return `đã bình luận: "${meta?.comment ?? ''}"`
    case 'attachment_added':  return 'đã đính kèm tệp'
    default:                  return 'đã thực hiện hành động'
  }
}

function actionColor(action: ActivityEntry['action']): string {
  switch (action) {
    case 'created':           return '#10b981'
    case 'status_changed':    return '#6366f1'
    case 'priority_changed':  return '#f59e0b'
    case 'comment_added':     return C.accent
    default:                  return C.muted
  }
}

interface Props {
  taskId: string
}

export function TaskSheetActivityLog({ taskId }: Props) {
  const [entries, setEntries] = useState<ActivityEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!taskId) return
    setLoading(true)
    taskActivityService.getByTaskId(taskId).then((data) => {
      setEntries(data)
      setLoading(false)
    })
  }, [taskId])

  return (
    <div className="flex flex-col gap-2">
      <p
        className="text-[11px] font-medium uppercase tracking-[0.06em]"
        style={{ color: C.muted }}
      >
        Lịch sử hoạt động
      </p>

      {loading && (
        <p className="text-[12px]" style={{ color: C.muted }}>Đang tải...</p>
      )}

      {!loading && entries.length === 0 && (
        <p className="text-[12px]" style={{ color: C.muted }}>Chưa có hoạt động nào.</p>
      )}

      <div className="flex flex-col">
        {entries.map((entry, index) => (
          <div key={entry.id} className="flex gap-3">
            {/* Avatar column with connecting line */}
            <div className="flex flex-col items-center shrink-0">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center z-10 mt-2"
                style={{ backgroundColor: actionColor(entry.action) + '20', border: `1.5px solid ${actionColor(entry.action)}` }}
              >
                <User className="h-2.5 w-2.5" style={{ color: actionColor(entry.action) }} />
              </div>
              {index < entries.length - 1 && (
                <div
                  className="w-px flex-1 mt-1"
                  style={{ backgroundColor: C.border, minHeight: '12px' }}
                />
              )}
            </div>

            <div className="flex-1 min-w-0 py-2">
              <p className="text-[12px] leading-relaxed" style={{ color: C.text }}>
                <span className="font-medium">{entry.userName}</span>{' '}
                <span style={{ color: C.muted }}>{actionLabel(entry)}</span>
              </p>
              <div className="flex items-center gap-1 mt-0.5" style={{ color: C.muted }}>
                <Clock className="h-2.5 w-2.5" />
                <span className="text-[11px]">{timeAgo(entry.createdAtUtc)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
