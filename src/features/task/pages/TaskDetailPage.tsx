import { type ElementType, type ReactNode } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, CheckCircle2, Clock, ExternalLink, Flag, User } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { useMockTaskDetail } from '../hooks/useMockTaskData'
import { TaskSheetComments } from '../components/detail/TaskSheetComments'
import { TaskSheetSubTasks } from '../components/detail/TaskSheetSubTasks'

const C = {
  text: '#141413',
  muted: '#8e8b82',
  border: '#e6dfd8',
  accent: '#cc785c',
  bg: '#FFFFFF',
  bgPage: '#faf9f5',
} as const

function priorityColor(name?: string): string {
  const p = (name ?? '').toLowerCase()
  if (p === 'urgent') return '#ef4444'
  if (p === 'high') return '#f97316'
  if (p === 'medium') return '#f59e0b'
  return '#94a3b8'
}

function formatDate(iso?: string): string {
  if (!iso) return '—'
  try { return format(parseISO(iso), 'dd MMM yyyy') } catch { return '—' }
}

function Pill({ label, color }: { label?: string; color?: string }) {
  if (!label) return <span style={{ color: C.muted }}>—</span>
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-medium"
      style={{ backgroundColor: `${color}18`, color }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  )
}

function PropertyRow({
  icon: Icon,
  label,
  children,
}: {
  icon: ElementType
  label: string
  children: ReactNode
}) {
  return (
    <div
      className="flex items-start gap-2 px-2 py-1.5 rounded-lg transition-colors duration-[120ms]"
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = '#f5f0e8' }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}
    >
      <div className="flex items-center gap-1.5 w-[88px] shrink-0 pt-0.5" style={{ color: C.muted }}>
        <Icon className="h-3.5 w-3.5 shrink-0" />
        <span className="text-[11px] leading-none">{label}</span>
      </div>
      <div className="flex-1 min-w-0 text-[13px] leading-snug" style={{ color: C.text }}>
        {children}
      </div>
    </div>
  )
}

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isLoading, notFound, task } = useMockTaskDetail(id)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div
          className="animate-spin rounded-full h-7 w-7 border-b-2"
          style={{ borderColor: C.accent }}
        />
      </div>
    )
  }

  if (notFound || !task) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-3">
        <p className="text-[14px]" style={{ color: C.muted }}>Task không tồn tại.</p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-[13px] cursor-pointer"
          style={{ color: C.accent }}
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-full" style={{ backgroundColor: C.bgPage }}>
      {/* Top bar */}
      <div
        className="flex items-center gap-3 h-12 px-6 shrink-0 sticky top-0 z-10"
        style={{ backgroundColor: C.bg, borderBottom: `0.5px solid ${C.border}` }}
      >
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-[13px] cursor-pointer transition-colors duration-[120ms]"
          style={{ color: C.muted }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = C.text }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = C.muted }}
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </button>

        {task.code && (
          <>
            <span style={{ color: C.border }}>·</span>
            <span
              className="text-[11px] font-medium px-1.5 py-0.5 rounded"
              style={{ backgroundColor: '#f5f0e8', color: C.muted }}
            >
              {task.code}
            </span>
          </>
        )}

        <div className="flex-1" />

        <a
          href={`/task/${task.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-[12px] cursor-pointer transition-colors duration-[120ms]"
          style={{ color: C.muted }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = C.text }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = C.muted }}
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Mở tab mới
        </a>
      </div>

      {/* Main content — two-column layout */}
      <div className="max-w-5xl mx-auto px-6 py-8 flex gap-10">

        {/* Left: main content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <h1
            className="text-[24px] font-semibold leading-snug mb-6"
            style={{
              color: C.text,
              fontFamily: '"Cormorant Garamond", Garamond, serif',
            }}
          >
            {task.title}
          </h1>

          {/* Description */}
          <div className="mb-8">
            <p
              className="text-[11px] font-medium uppercase tracking-[0.06em] mb-2"
              style={{ color: C.muted }}
            >
              Mô tả
            </p>
            {task.description ? (
              <div
                className="tiptap-editor-content"
                style={{ fontSize: 14, lineHeight: 1.7, color: C.text }}
                dangerouslySetInnerHTML={{ __html: task.description }}
              />
            ) : (
              <p className="text-[13px]" style={{ color: C.muted }}>
                Chưa có mô tả.
              </p>
            )}
          </div>

          {/* Sub-tasks */}
          <div className="mb-8">
            <TaskSheetSubTasks taskId={task.id} />
          </div>

          <div className="my-6" style={{ height: '0.5px', backgroundColor: C.border }} />

          {/* Comments */}
          <TaskSheetComments taskId={task.id} />
        </div>

        {/* Right: properties sidebar */}
        <div className="w-64 shrink-0">
          <div
            className="rounded-xl overflow-hidden"
            style={{ backgroundColor: C.bg, border: `0.5px solid ${C.border}` }}
          >
            {/* Header */}
            <div
              className="px-4 py-3"
              style={{ borderBottom: `0.5px solid ${C.border}`, backgroundColor: '#faf9f5' }}
            >
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.08em]"
                style={{ color: C.muted }}
              >
                Thông tin
              </p>
            </div>

            {/* Properties */}
            <div className="px-2 py-2 flex flex-col gap-0.5">
              <PropertyRow icon={CheckCircle2} label="Trạng thái">
                <Pill label={task.statusName} color="#6366f1" />
              </PropertyRow>

              <PropertyRow icon={Flag} label="Ưu tiên">
                <Pill label={task.priorityName} color={priorityColor(task.priorityName)} />
              </PropertyRow>

              <PropertyRow icon={User} label="Người tạo">
                {task.creatorName ? (
                  <span className="flex items-center gap-1.5 min-w-0">
                    <span
                      className="w-5 h-5 shrink-0 rounded-full flex items-center justify-center text-[9px] font-semibold text-white"
                      style={{ backgroundColor: C.accent }}
                    >
                      {task.creatorName.charAt(0).toUpperCase()}
                    </span>
                    <span className="truncate">{task.creatorName}</span>
                  </span>
                ) : <span style={{ color: C.muted }}>—</span>}
              </PropertyRow>

              <PropertyRow icon={Calendar} label="Bắt đầu">
                <span style={{ color: task.startDate ? C.text : C.muted }}>
                  {formatDate(task.startDate)}
                </span>
              </PropertyRow>

              <PropertyRow icon={Calendar} label="Hạn chót">
                <span style={{ color: task.dueDate ? C.text : C.muted }}>
                  {formatDate(task.dueDate)}
                </span>
              </PropertyRow>

              {task.estimatedHours && (
                <PropertyRow icon={Clock} label="Ước tính">
                  <span>{task.estimatedHours}h</span>
                </PropertyRow>
              )}
            </div>

            {/* Timestamps footer */}
            <div
              className="px-4 py-2.5 flex flex-col gap-0.5"
              style={{ borderTop: `0.5px solid ${C.border}`, backgroundColor: '#faf9f5' }}
            >
              <p className="text-[11px]" style={{ color: C.muted }}>
                <span className="font-medium">Tạo:</span> {formatDate(task.createdAtUtc)}
              </p>
              {task.modifiedAtUtc && (
                <p className="text-[11px]" style={{ color: C.muted }}>
                  <span className="font-medium">Sửa:</span> {formatDate(task.modifiedAtUtc)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
