import { ExternalLink, MoreHorizontal, Star, Trash2, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { Task } from '../../types/task.types'

interface TaskSheetHeaderProps {
  task?: Task | null
  onClose: () => void
  isUpdating?: boolean
  isFavorite?: boolean
  onToggleFavorite?: () => void
}

export function TaskSheetHeader({ task, onClose, isUpdating = false, isFavorite = false, onToggleFavorite }: TaskSheetHeaderProps) {
  const navigate = useNavigate()

  return (
    <div
      className="flex items-center justify-between h-11 px-3 shrink-0"
      style={{ borderBottom: '0.5px solid #e6dfd8' }}
    >
      {/* Left: close + code */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onClose}
          disabled={isUpdating}
          aria-label="Đóng"
          className="w-7 h-7 flex items-center justify-center rounded-md cursor-pointer transition-colors duration-150"
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = '#f5f0e8' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}
        >
          <X className="h-[15px] w-[15px]" style={{ color: '#6c6a64' }} />
        </button>

        {task?.code && (
          <span
            className="text-[11px] font-medium rounded px-1.5 py-0.5"
            style={{ backgroundColor: '#f5f0e8', color: '#8e8b82' }}
          >
            {task.code}
          </span>
        )}
      </div>

      {/* Right: saving indicator + actions */}
      <div className="flex items-center gap-0.5">
        {isUpdating && (
          <span className="text-[11px] mr-2" style={{ color: '#8e8b82' }}>
            Đang lưu...
          </span>
        )}

        {task && (
          <>
            {onToggleFavorite && (
              <button
                type="button"
                aria-label={isFavorite ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
                title={isFavorite ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
                onClick={onToggleFavorite}
                className="w-7 h-7 flex items-center justify-center rounded-md cursor-pointer transition-colors duration-150"
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = '#f5f0e8' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}
              >
                <Star
                  className="h-[14px] w-[14px]"
                  style={{
                    color: isFavorite ? '#cc785c' : '#6c6a64',
                    fill: isFavorite ? '#cc785c' : 'transparent',
                  }}
                />
              </button>
            )}

            <button
              type="button"
              aria-label="Mở trang đầy đủ"
              title="Mở trang đầy đủ"
              className="w-7 h-7 flex items-center justify-center rounded-md cursor-pointer transition-colors duration-150"
              onClick={() => navigate(`/task/${task.id}`)}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = '#f5f0e8' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}
            >
              <ExternalLink className="h-[14px] w-[14px]" style={{ color: '#6c6a64' }} />
            </button>

            <button
              type="button"
              aria-label="Xóa task"
              className="w-7 h-7 flex items-center justify-center rounded-md cursor-pointer transition-colors duration-150"
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = '#FDECEA' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}
            >
              <Trash2 className="h-[14px] w-[14px]" style={{ color: '#c64545' }} />
            </button>
          </>
        )}

        <button
          type="button"
          aria-label="Thêm tùy chọn"
          className="w-7 h-7 flex items-center justify-center rounded-md cursor-pointer transition-colors duration-150"
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = '#f5f0e8' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}
        >
          <MoreHorizontal className="h-[15px] w-[15px]" style={{ color: '#6c6a64' }} />
        </button>
      </div>
    </div>
  )
}
