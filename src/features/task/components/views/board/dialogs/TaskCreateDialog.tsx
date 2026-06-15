import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import {
  AlignLeft,
  CalendarIcon,
  CheckCircle2,
  Clock,
  FileText,
  Flag,
  Hash,
  Plus,
  User,
} from 'lucide-react'
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { AssigneeSelector, type UserOption } from '@/features/task/components/detail/TaskSheetAssigneeSelector'
import { useMockTaskMeta } from '@/features/task/hooks/useMockTaskData'
import { taskItemService } from '@/features/task/mocks/task.mock'
import type { CreateTaskRequest, TaskItemDto } from '@/features/task/types/task.types'
import { useAuthStore } from '@/stores/auth.store'

// ── Design tokens (matches task page palette) ─────────────────────────────────
const C = {
  bg: '#FFFFFF',
  bgHover: '#f5f0e8',
  text: '#141413',
  muted: '#8e8b82',
  border: '#e6dfd8',
  accent: '#cc785c',
} as const

const MOCK_USERS: UserOption[] = [
  { value: 'hieudd', label: 'Hiếu Đức', initials: 'HD' },
  { value: 'quanghuy', label: 'Quang Huy', initials: 'QH' },
]

const taskFormSchema = z.object({
  title: z.string().min(1, 'Tiêu đề không được để trống'),
  description: z.string().optional(),
  statusId: z.string().min(1, 'Vui lòng chọn trạng thái'),
  priorityId: z.string().optional(),
  dueDate: z.date().optional(),
  startDate: z.date().optional(),
  estimatedHours: z.number().min(0).optional(),
})

type TaskFormData = z.infer<typeof taskFormSchema>

const TASK_TEMPLATES = [
  { name: 'Báo lỗi',                  title: '[BUG] ',   description: '## Mô tả lỗi\n\n## Bước tái hiện\n1. \n2. \n\n## Kết quả mong đợi\n\n## Kết quả thực tế\n' },
  { name: 'Yêu cầu tính năng',        title: '[FEAT] ',  description: '## User story\n\nLà người dùng, tôi muốn...\n\n## Tiêu chí chấp nhận\n- [ ] \n- [ ] \n' },
  { name: 'Dọn dẹp / Tái cấu trúc',  title: '[CHORE] ', description: '## Việc cần làm\n\n## Lý do\n' },
  { name: 'Nghiên cứu / Khám phá',    title: '[SPIKE] ', description: '## Câu hỏi nghiên cứu\n\n## Kết quả mong đợi\n\n## Time box\n' },
]

interface TaskCreateDialogProps {
  children?: ReactNode
  defaultStatusId?: string
  onTaskCreated?: (task?: TaskItemDto) => void
  trigger?: ReactNode
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function hexAlpha(hex: string, alpha: number) {
  if (!hex?.startsWith('#')) return 'transparent'
  return `${hex}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatusPill({ color, label }: { color?: string; label: string }) {
  const bg = color ? hexAlpha(color, 0.12) : C.bgHover
  const txt = color || '#6c6a64'
  return (
    <div
      className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[12px] font-medium"
      style={{ backgroundColor: bg, color: txt }}
    >
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: txt }} />
      {label}
    </div>
  )
}

function PropertyRow({
  icon,
  label,
  children,
  error,
}: {
  icon: ReactNode
  label: string
  children: ReactNode
  error?: string
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <div>
      <div
        className="flex items-center min-h-[34px] -mx-4 px-4 rounded-md transition-colors duration-[120ms]"
        style={{ backgroundColor: hovered ? C.bgHover : 'transparent' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          className="w-[140px] flex-none flex items-center gap-2 text-[12px]"
          style={{ color: C.muted }}
        >
          {icon}
          <span>{label}</span>
        </div>
        <div className="flex-1 flex items-center min-w-0">{children}</div>
      </div>
      {error && (
        <p className="text-[11px] ml-4 mt-0.5" style={{ color: '#e53e3e' }}>
          {error}
        </p>
      )}
    </div>
  )
}

function InlineDatePicker({
  value,
  placeholder,
  onChange,
}: {
  value?: Date
  placeholder: string
  onChange: (d: Date | undefined) => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-1.5 text-[12px] cursor-pointer transition-colors duration-[120ms] rounded px-1 py-0.5 -ml-1"
          style={{ color: value ? C.text : C.muted }}
          onMouseEnter={(e) => { (e.currentTarget).style.backgroundColor = C.bgHover }}
          onMouseLeave={(e) => { (e.currentTarget).style.backgroundColor = 'transparent' }}
        >
          <CalendarIcon className="h-3 w-3 shrink-0" style={{ color: C.muted }} />
          {value ? format(value, 'dd/MM/yyyy') : placeholder}
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0"
        align="start"
        style={{ border: `0.5px solid ${C.border}`, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
      >
        <Calendar
          mode="single"
          selected={value}
          onSelect={(d) => { onChange(d); setOpen(false) }}
        />
      </PopoverContent>
    </Popover>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

const SELECT_TRIGGER_CLASS =
  'h-auto w-fit border-none shadow-none ring-0 focus:ring-0 focus-visible:ring-0 p-0 gap-0 [&>svg]:hidden cursor-pointer'

const SELECT_CONTENT_STYLE = {
  backgroundColor: C.bg,
  border: `0.5px solid ${C.border}`,
  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
}

export function TaskCreateDialog({
  children,
  defaultStatusId,
  onTaskCreated,
  trigger,
}: TaskCreateDialogProps) {
  const user = useAuthStore((s) => s.user)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [assignee, setAssignee] = useState('')
  const [templatePopoverOpen, setTemplatePopoverOpen] = useState(false)
  const { isLoading: loadingData, priorities, statuses } = useMockTaskMeta()

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: '',
      description: '',
      statusId: defaultStatusId || '',
      priorityId: '',
      estimatedHours: undefined,
    },
  })

  useEffect(() => {
    if (!open) return
    if (!defaultStatusId && statuses.length > 0) {
      const activeStatus = statuses.find((status) => status.isActive) || statuses[0]
      if (!form.getValues('statusId')) {
        form.setValue('statusId', activeStatus.id)
      }
    }
    if (priorities.length > 0 && !form.getValues('priorityId')) {
      const activePriority = priorities.find((priority) => priority.isActive) || priorities[0]
      form.setValue('priorityId', activePriority.id)
    }
  }, [defaultStatusId, form, open, priorities, statuses])

  useEffect(() => {
    if (defaultStatusId) form.setValue('statusId', defaultStatusId)
  }, [defaultStatusId, form])

  const handleClose = () => {
    setOpen(false)
    form.reset()
    setAssignee('')
  }

  const generateTaskCode = () => {
    const ts = Date.now()
    const rnd = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    return `TASK-${ts}-${rnd}`
  }

  const handleCreateTask = async (data: TaskFormData) => {
    try {
      setLoading(true)
      const taskData: CreateTaskRequest = {
        code: generateTaskCode(),
        title: data.title,
        description: data.description,
        statusId: data.statusId,
        priorityId: data.priorityId || undefined,
        creatorId: user?.id ?? 'user-mock',
        dueDate: data.dueDate?.toISOString(),
        startDate: data.startDate?.toISOString(),
        estimatedHours: data.estimatedHours,
        isActive: true,
      }
      const newTask = await taskItemService.create(taskData)
      toast.success('Đã tạo task thành công')
      handleClose()
      onTaskCreated?.(newTask)
    } catch {
      toast.error('Không thể tạo task. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  const selectedStatusId = useWatch({ control: form.control, name: 'statusId' })
  const selectedPriorityId = useWatch({ control: form.control, name: 'priorityId' })

  const selectedStatus = useMemo(
    () => statuses.find((s) => s.id === selectedStatusId),
    [statuses, selectedStatusId],
  )
  const selectedPriority = useMemo(
    () => priorities.find((p) => p.id === selectedPriorityId),
    [priorities, selectedPriorityId],
  )

  const activeStatuses = useMemo(() => statuses.filter((s) => s.isActive), [statuses])
  const activePriorities = useMemo(
    () => priorities.filter((p) => p.isActive).sort((a, b) => b.level - a.level),
    [priorities],
  )

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); else setOpen(true) }}>
      <DialogTrigger asChild>
        {trigger || children || (
          <Button size="sm" className="h-8 gap-1 px-3">
            <Plus className="h-3.5 w-3.5" />
            <span className="font-medium">Tạo Task</span>
          </Button>
        )}
      </DialogTrigger>

      <DialogContent
        className="p-0 gap-0 overflow-hidden sm:max-w-[560px]"
        style={{
          backgroundColor: C.bg,
          border: `0.5px solid ${C.border}`,
          borderRadius: 12,
          boxShadow: '0 8px 40px rgba(0,0,0,0.14)',
        }}
      >
        <DialogTitle className="sr-only">Tạo Task mới</DialogTitle>
        <DialogDescription className="sr-only">
          Điền thông tin để tạo task mới
        </DialogDescription>

        {loadingData ? (
          <div className="flex items-center justify-center h-56">
            <div className="text-center">
              <div
                className="animate-spin rounded-full h-6 w-6 border-b-2 mx-auto mb-3"
                style={{ borderColor: C.accent }}
              />
              <p className="text-[13px]" style={{ color: C.muted }}>
                Đang tải dữ liệu...
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={form.handleSubmit(handleCreateTask)}>

            {/* ── Title ── */}
            <div className="px-6 pt-6 pb-2">
              <Controller
                control={form.control}
                name="title"
                render={({ field, fieldState }) => (
                  <>
                    <textarea
                      {...field}
                      autoFocus
                      rows={1}
                      placeholder="Tiêu đề task..."
                      className="w-full resize-none bg-transparent border-none outline-none font-semibold leading-snug"
                      style={{
                        fontSize: 20,
                        color: C.text,
                        caretColor: C.accent,
                        fontFamily: '"Cormorant Garamond", Garamond, serif',
                        overflow: 'hidden',
                      }}
                      onInput={(e) => {
                        const el = e.currentTarget
                        el.style.height = 'auto'
                        el.style.height = `${el.scrollHeight}px`
                      }}
                    />
                    {fieldState.error && (
                      <p className="text-[11px] mt-1" style={{ color: '#e53e3e' }}>
                        {fieldState.error.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>

            {/* ── Template picker ── */}
            <div className="px-6 pb-1">
              <Popover open={templatePopoverOpen} onOpenChange={setTemplatePopoverOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded cursor-pointer transition-colors duration-[100ms]"
                    style={{ color: C.muted, border: `0.5px dashed ${C.border}` }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = C.bgHover }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                  >
                    <FileText className="h-3 w-3" />
                    Dùng template
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  className="p-1 w-52"
                  style={{ backgroundColor: C.bg, border: `0.5px solid ${C.border}`, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
                >
                  {TASK_TEMPLATES.map((tpl) => (
                    <button
                      key={tpl.name}
                      type="button"
                      className="flex items-center gap-2 w-full px-2 py-1.5 rounded text-[13px] cursor-pointer transition-colors duration-[100ms] text-left"
                      style={{ color: C.text }}
                      onClick={() => {
                        form.setValue('title', tpl.title)
                        form.setValue('description', tpl.description)
                        setTemplatePopoverOpen(false)
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = C.bgHover }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                    >
                      {tpl.name}
                    </button>
                  ))}
                </PopoverContent>
              </Popover>
            </div>

            {/* ── Description ── */}
            <div className="px-6 pb-5">
              <Controller
                control={form.control}
                name="description"
                render={({ field }) => (
                  <div className="flex items-start gap-2">
                    <AlignLeft
                      className="h-3.5 w-3.5 mt-[3px] shrink-0"
                      style={{ color: C.muted }}
                    />
                    <textarea
                      {...field}
                      rows={2}
                      placeholder="Thêm mô tả..."
                      className="flex-1 resize-none bg-transparent border-none outline-none leading-relaxed"
                      style={{ fontSize: 13, color: C.text, caretColor: C.accent }}
                      onInput={(e) => {
                        const el = e.currentTarget
                        el.style.height = 'auto'
                        el.style.height = `${el.scrollHeight}px`
                      }}
                    />
                  </div>
                )}
              />
            </div>

            {/* ── Divider ── */}
            <div style={{ height: '0.5px', backgroundColor: C.border }} />

            {/* ── Properties ── */}
            <div className="px-4 py-3 flex flex-col gap-0.5">

              {/* Status */}
              <PropertyRow
                icon={<CheckCircle2 className="h-3.5 w-3.5 shrink-0" />}
                label="Trạng thái"
                error={form.formState.errors.statusId?.message}
              >
                <Controller
                  control={form.control}
                  name="statusId"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className={SELECT_TRIGGER_CLASS}>
                        <SelectValue>
                          {selectedStatus ? (
                            <StatusPill color={selectedStatus.color} label={selectedStatus.name} />
                          ) : (
                            <span className="text-[12px]" style={{ color: C.muted }}>
                              Chọn trạng thái
                            </span>
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent
                        position="popper"
                        align="start"
                        sideOffset={4}
                        className="min-w-[160px] p-1 [&_[data-highlighted]]:bg-[#f5f0e8] [&_[data-highlighted]]:text-[#141413]"
                        style={SELECT_CONTENT_STYLE}
                      >
                        {activeStatuses.map((s) => (
                          <SelectItem
                            key={s.id}
                            value={s.id}
                            className="text-[13px] rounded-md cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className="w-2 h-2 rounded-full shrink-0"
                                style={{ backgroundColor: s.color }}
                              />
                              {s.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </PropertyRow>

              {/* Priority */}
              <PropertyRow
                icon={<Flag className="h-3.5 w-3.5 shrink-0" />}
                label="Độ ưu tiên"
              >
                <Controller
                  control={form.control}
                  name="priorityId"
                  render={({ field }) => (
                    <Select
                      value={field.value || 'none'}
                      onValueChange={(v) => field.onChange(v === 'none' ? '' : v)}
                    >
                      <SelectTrigger className={SELECT_TRIGGER_CLASS}>
                        <SelectValue>
                          {selectedPriority ? (
                            <StatusPill color={selectedPriority.color} label={selectedPriority.name} />
                          ) : (
                            <span className="text-[12px]" style={{ color: C.muted }}>
                              Không có
                            </span>
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent
                        position="popper"
                        align="start"
                        sideOffset={4}
                        className="min-w-[160px] p-1 [&_[data-highlighted]]:bg-[#f5f0e8] [&_[data-highlighted]]:text-[#141413]"
                        style={SELECT_CONTENT_STYLE}
                      >
                        <SelectItem
                          value="none"
                          className="text-[13px] rounded-md cursor-pointer"
                        >
                          <span style={{ color: C.muted }}>Không có</span>
                        </SelectItem>
                        {activePriorities.map((p) => (
                          <SelectItem
                            key={p.id}
                            value={p.id}
                            className="text-[13px] rounded-md cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className="w-2 h-2 rounded-full shrink-0"
                                style={{ backgroundColor: p.color }}
                              />
                              {p.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </PropertyRow>

              {/* Assignee */}
              <PropertyRow
                icon={<User className="h-3.5 w-3.5 shrink-0" />}
                label="Người thực hiện"
              >
                <AssigneeSelector
                  users={MOCK_USERS}
                  value={assignee}
                  onChange={setAssignee}
                />
              </PropertyRow>

              {/* Start date */}
              <PropertyRow
                icon={<CalendarIcon className="h-3.5 w-3.5 shrink-0" />}
                label="Ngày bắt đầu"
              >
                <Controller
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <InlineDatePicker
                      value={field.value}
                      placeholder="Chọn ngày"
                      onChange={field.onChange}
                    />
                  )}
                />
              </PropertyRow>

              {/* Due date */}
              <PropertyRow
                icon={<CalendarIcon className="h-3.5 w-3.5 shrink-0" />}
                label="Ngày đến hạn"
              >
                <Controller
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <InlineDatePicker
                      value={field.value}
                      placeholder="Chọn ngày"
                      onChange={field.onChange}
                    />
                  )}
                />
              </PropertyRow>

              {/* Estimated hours */}
              <PropertyRow
                icon={<Clock className="h-3.5 w-3.5 shrink-0" />}
                label="Ước tính (giờ)"
              >
                <Controller
                  control={form.control}
                  name="estimatedHours"
                  render={({ field }) => (
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        placeholder="—"
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === '' ? undefined : parseFloat(e.target.value),
                          )
                        }
                        className="w-16 bg-transparent border-none outline-none text-[12px]"
                        style={{ color: C.text }}
                      />
                      {field.value != null && (
                        <span className="text-[12px]" style={{ color: C.muted }}>
                          giờ
                        </span>
                      )}
                    </div>
                  )}
                />
              </PropertyRow>

              {/* Task code preview */}
              <PropertyRow
                icon={<Hash className="h-3.5 w-3.5 shrink-0" />}
                label="Mã task"
              >
                <span className="text-[12px]" style={{ color: C.muted }}>
                  Tự động tạo
                </span>
              </PropertyRow>

            </div>

            {/* ── Divider ── */}
            <div style={{ height: '0.5px', backgroundColor: C.border }} />

            {/* ── Footer ── */}
            <div className="px-6 py-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors duration-[120ms] cursor-pointer"
                style={{ color: C.muted }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget).style.backgroundColor = C.bgHover
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget).style.backgroundColor = 'transparent'
                }}
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-1.5 rounded-md text-[13px] font-medium text-white transition-opacity duration-[120ms] cursor-pointer"
                style={{ backgroundColor: C.accent, opacity: loading ? 0.65 : 1 }}
              >
                {loading ? 'Đang tạo...' : 'Tạo Task'}
              </button>
            </div>

          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
