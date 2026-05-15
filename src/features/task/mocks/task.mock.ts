// TODO: Remove when BE API is ready — revert imports in:
//   TaskView.tsx, KanbanBoard.tsx, TaskCreateDialog.tsx, PriorityManagerDialog.tsx
import type { TaskStatusDto, TaskItemDto, CreateTaskRequest, UpdateTaskRequest, CreateTaskStatusRequest, UpdateTaskStatusRequest, TaskAttachment, DependencyType, TaskDependenciesView, CustomPropDef, CustomPropValue, ActivityEntry, ActivityAction } from '../types/task.types'
import type { TaskPriorityDto, CreatePriorityRequest, UpdatePriorityRequest } from '../types/priority.types'

// ─── Seed data ──────────────────────────────────────────────────────────────

const SEED_STATUSES: TaskStatusDto[] = [
  { id: 'status-1', code: 'TODO', name: 'To Do', color: '#6366f1', order: 1, isSystem: true, isActive: true, createdAtUtc: '2025-01-01T00:00:00Z' },
  { id: 'status-2', code: 'IN_PROGRESS', name: 'In Progress', color: '#f59e0b', order: 2, isSystem: true, isActive: true, createdAtUtc: '2025-01-01T00:00:00Z' },
  { id: 'status-3', code: 'IN_REVIEW', name: 'In Review', color: '#8b5cf6', order: 3, isSystem: true, isActive: true, createdAtUtc: '2025-01-01T00:00:00Z' },
  { id: 'status-4', code: 'DONE', name: 'Done', color: '#10b981', order: 4, isSystem: true, isActive: true, createdAtUtc: '2025-01-01T00:00:00Z' },
]

const SEED_PRIORITIES: TaskPriorityDto[] = [
  { id: 'priority-1', code: 'LOW', name: 'Low', level: 1, color: '#94a3b8', isActive: true, isSystem: true },
  { id: 'priority-2', code: 'MEDIUM', name: 'Medium', level: 2, color: '#f59e0b', isActive: true, isSystem: true },
  { id: 'priority-3', code: 'HIGH', name: 'High', level: 3, color: '#f97316', isActive: true, isSystem: true },
  { id: 'priority-4', code: 'URGENT', name: 'Urgent', level: 4, color: '#ef4444', isActive: true, isSystem: true },
]

const SEED_TASKS: TaskItemDto[] = [
  { id: 'task-1', code: 'TASK-001', title: 'Thiết kế UI trang Dashboard', description: 'Thiết kế giao diện tổng quan cho module Dashboard', statusId: 'status-1', statusName: 'To Do', priorityId: 'priority-3', priorityName: 'High', creatorId: 'user-1', creatorName: 'Nguyễn Văn A', dueDate: '2026-05-20T00:00:00Z', isActive: true, createdAtUtc: '2026-05-01T00:00:00Z' },
  { id: 'task-2', code: 'TASK-002', title: 'Tích hợp API xác thực người dùng', description: 'Kết nối frontend với API đăng nhập/đăng xuất', statusId: 'status-1', statusName: 'To Do', priorityId: 'priority-2', priorityName: 'Medium', creatorId: 'user-2', creatorName: 'Trần Thị B', dueDate: '2026-05-25T00:00:00Z', isActive: true, createdAtUtc: '2026-05-02T00:00:00Z' },
  { id: 'task-3', code: 'TASK-003', title: 'Xây dựng module quản lý nhân sự', description: 'CRUD nhân viên, phòng ban, chức vụ', statusId: 'status-2', statusName: 'In Progress', priorityId: 'priority-3', priorityName: 'High', creatorId: 'user-1', creatorName: 'Nguyễn Văn A', dueDate: '2026-05-18T00:00:00Z', isActive: true, createdAtUtc: '2026-05-03T00:00:00Z' },
  { id: 'task-4', code: 'TASK-004', title: 'Fix bug layout responsive mobile', description: 'Sidebar bị vỡ trên màn hình nhỏ hơn 768px', statusId: 'status-2', statusName: 'In Progress', priorityId: 'priority-4', priorityName: 'Urgent', creatorId: 'user-3', creatorName: 'Lê Văn C', dueDate: '2026-05-14T00:00:00Z', isActive: true, createdAtUtc: '2026-05-04T00:00:00Z' },
  { id: 'task-5', code: 'TASK-005', title: 'Code review module Task Management', description: 'Review PR #42 — Kanban board implementation', statusId: 'status-3', statusName: 'In Review', priorityId: 'priority-2', priorityName: 'Medium', creatorId: 'user-2', creatorName: 'Trần Thị B', dueDate: '2026-05-15T00:00:00Z', isActive: true, createdAtUtc: '2026-05-05T00:00:00Z', parentId: 'task-3', parentCode: 'TASK-003', parentTitle: 'Xây dựng module quản lý nhân sự' } as TaskItemDto & { parentId?: string; parentCode?: string; parentTitle?: string },
  { id: 'task-6', code: 'TASK-006', title: 'Viết unit test cho auth service', description: 'Coverage tối thiểu 80% cho authentication module', statusId: 'status-3', statusName: 'In Review', priorityId: 'priority-1', priorityName: 'Low', creatorId: 'user-1', creatorName: 'Nguyễn Văn A', dueDate: '2026-05-16T00:00:00Z', isActive: true, createdAtUtc: '2026-05-06T00:00:00Z', parentId: 'task-3', parentCode: 'TASK-003', parentTitle: 'Xây dựng module quản lý nhân sự' } as TaskItemDto & { parentId?: string; parentCode?: string; parentTitle?: string },
  { id: 'task-7', code: 'TASK-007', title: 'Deploy staging environment', description: 'Setup CI/CD pipeline và deploy lên môi trường staging', statusId: 'status-4', statusName: 'Done', priorityId: 'priority-3', priorityName: 'High', creatorId: 'user-3', creatorName: 'Lê Văn C', dueDate: '2026-05-10T00:00:00Z', isActive: true, createdAtUtc: '2026-05-07T00:00:00Z' },
  { id: 'task-8', code: 'TASK-008', title: 'Cấu hình database migrations', description: 'Setup EF Core migrations cho production', statusId: 'status-4', statusName: 'Done', priorityId: 'priority-2', priorityName: 'Medium', creatorId: 'user-2', creatorName: 'Trần Thị B', dueDate: '2026-05-08T00:00:00Z', isActive: true, createdAtUtc: '2026-05-08T00:00:00Z' },
]

// ─── In-memory store ─────────────────────────────────────────────────────────

let _statuses = [...SEED_STATUSES]
let _priorities = [...SEED_PRIORITIES]
let _tasks = [...SEED_TASKS]
let _sid = SEED_STATUSES.length + 1
let _pid = SEED_PRIORITIES.length + 1
let _tid = SEED_TASKS.length + 1

const delay = (ms = 150) => new Promise<void>((r) => setTimeout(r, ms))

// ─── taskStatusService mock ───────────────────────────────────────────────────

export const taskStatusService = {
  getAllForDropdown: async (): Promise<TaskStatusDto[]> => {
    await delay()
    return [..._statuses]
  },

  create: async (data: CreateTaskStatusRequest): Promise<TaskStatusDto> => {
    await delay()
    const s: TaskStatusDto = {
      id: `status-${_sid++}`,
      code: data.code,
      name: data.name,
      color: data.color ?? '#808080',
      order: data.order,
      isSystem: data.isSystem ?? false,
      isActive: data.isActive ?? true,
      createdAtUtc: new Date().toISOString(),
    }
    _statuses.push(s)
    return s
  },

  update: async (id: string, data: UpdateTaskStatusRequest): Promise<TaskStatusDto> => {
    await delay()
    _statuses = _statuses.map((s) => (s.id === id ? { ...s, ...data } : s))
    return _statuses.find((s) => s.id === id)!
  },

  getAll: async () => { await delay(); return { items: _statuses, page: 1, pageSize: 50, totalCount: _statuses.length } },
  getById: async (id: string) => { await delay(); return _statuses.find((s) => s.id === id)! },
  getByCode: async (code: string) => { await delay(); return _statuses.find((s) => s.code === code)! },
  toggleActive: async (id: string) => { await delay(); _statuses = _statuses.map((s) => s.id === id ? { ...s, isActive: !s.isActive } : s); return _statuses.find((s) => s.id === id)! },
}

// ─── taskItemService mock ─────────────────────────────────────────────────────

export const taskItemService = {
  getTasksByStatusId: async (statusId: string): Promise<{ items: TaskItemDto[]; page: number; pageSize: number; totalCount: number }> => {
    await delay()
    const items = _tasks.filter((t) => t.statusId === statusId)
    return { items, page: 1, pageSize: 50, totalCount: items.length }
  },

  create: async (data: CreateTaskRequest): Promise<TaskItemDto> => {
    await delay()
    const status = _statuses.find((s) => s.id === data.statusId)
    const priority = _priorities.find((p) => p.id === data.priorityId)
    const t: TaskItemDto = {
      id: `task-${_tid++}`,
      code: data.code ?? `TASK-${String(_tid).padStart(3, '0')}`,
      title: data.title,
      description: data.description,
      statusId: data.statusId,
      statusName: status?.name,
      priorityId: data.priorityId ?? '',
      priorityName: priority?.name,
      creatorId: data.creatorId ?? 'user-mock',
      creatorName: 'Mock User',
      dueDate: data.dueDate,
      startDate: data.startDate,
      estimatedHours: data.estimatedHours,
      isActive: data.isActive ?? true,
      createdAtUtc: new Date().toISOString(),
    }
    _tasks.push(t)
    return t
  },

  update: async (id: string, data: UpdateTaskRequest): Promise<TaskItemDto> => {
    await delay()
    const status = data.statusId ? _statuses.find((s) => s.id === data.statusId) : undefined
    const priority = data.priorityId ? _priorities.find((p) => p.id === data.priorityId) : undefined
    _tasks = _tasks.map((t) =>
      t.id === id
        ? { ...t, ...data, statusName: status?.name ?? t.statusName, priorityName: priority?.name ?? t.priorityName }
        : t,
    )
    return _tasks.find((t) => t.id === id)!
  },

  getAll: async () => { await delay(); return { items: _tasks, page: 1, pageSize: 50, totalCount: _tasks.length } },
  getById: async (id: string) => { await delay(); return _tasks.find((t) => t.id === id)! },
  getByCode: async (code: string) => { await delay(); return _tasks.find((t) => t.code === code)! },
  toggleActive: async (id: string) => { await delay(); _tasks = _tasks.map((t) => t.id === id ? { ...t, isActive: !t.isActive } : t); return _tasks.find((t) => t.id === id)! },
  updateStatus: async (id: string, data: { statusId: string }) => { return taskItemService.update(id, data) },
  updatePriority: async (id: string, data: { priorityId: string }) => { return taskItemService.update(id, data) },
  updateProgress: async (id: string, _data: { actualHours: number }) => { await delay(); return _tasks.find((t) => t.id === id)! },
  complete: async (id: string) => { return taskItemService.update(id, {}) },
  getMyTasks: async () => { await delay(); return { items: _tasks, page: 1, pageSize: 50, totalCount: _tasks.length } },
  getByProjectId: async () => { await delay(); return { items: [], page: 1, pageSize: 50, totalCount: 0 } },
  getByDepartmentId: async () => { await delay(); return { items: [], page: 1, pageSize: 50, totalCount: 0 } },
  getOverdueTasks: async () => { await delay(); return { items: [], page: 1, pageSize: 50, totalCount: 0 } },
  getUpcomingTasks: async () => { await delay(); return { items: [], page: 1, pageSize: 50, totalCount: 0 } },
  bulkCreate: async () => { await delay(); return [] },
  duplicate: async (id: string) => { await delay(); const t = _tasks.find((x) => x.id === id)!; return taskItemService.create({ ...t, code: `TASK-${_tid}` }) },
}

// ─── taskPriorityService mock ─────────────────────────────────────────────────

export const taskPriorityService = {
  getAllForDropdown: async (): Promise<TaskPriorityDto[]> => {
    await delay()
    return [..._priorities]
  },

  create: async (data: CreatePriorityRequest): Promise<TaskPriorityDto> => {
    await delay()
    const p: TaskPriorityDto = {
      id: `priority-${_pid++}`,
      code: data.code,
      name: data.name,
      level: data.level,
      color: data.color,
      isActive: data.isActive ?? true,
      isSystem: data.isSystem ?? false,
      createdAtUtc: new Date().toISOString(),
    }
    _priorities.push(p)
    return p
  },

  update: async (id: string, data: UpdatePriorityRequest): Promise<TaskPriorityDto> => {
    await delay()
    _priorities = _priorities.map((p) => (p.id === id ? { ...p, ...data } : p))
    return _priorities.find((p) => p.id === id)!
  },

  toggleActive: async (id: string): Promise<TaskPriorityDto> => {
    await delay()
    _priorities = _priorities.map((p) => p.id === id ? { ...p, isActive: !p.isActive } : p)
    return _priorities.find((p) => p.id === id)!
  },

  getAll: async () => { await delay(); return { items: _priorities, page: 1, pageSize: 50, totalCount: _priorities.length } },
  getById: async (id: string) => { await delay(); return _priorities.find((p) => p.id === id)! },
  getByCode: async (code: string) => { await delay(); return _priorities.find((p) => p.code === code)! },
}

// ─── Attachment store ────────────────────────────────────────────────────────

let _attachments: TaskAttachment[] = []
let _aid = 1

export const taskAttachmentService = {
  getByTaskId: async (taskId: string): Promise<TaskAttachment[]> => {
    await delay()
    return _attachments.filter((a) => a.taskId === taskId)
  },

  upload: async (taskId: string, file: File): Promise<TaskAttachment> => {
    const dataUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target!.result as string)
      reader.readAsDataURL(file)
    })
    const att: TaskAttachment = {
      id: `att-${_aid++}`,
      taskId,
      name: file.name,
      size: file.size,
      mimeType: file.type,
      dataUrl,
      uploadedAt: new Date().toISOString(),
    }
    _attachments.push(att)
    return att
  },

  delete: async (id: string): Promise<void> => {
    await delay()
    _attachments = _attachments.filter((a) => a.id !== id)
  },
}

// ─── Dependency store ────────────────────────────────────────────────────────

interface _Dep { id: string; fromTaskId: string; toTaskId: string; type: DependencyType }
let _deps: _Dep[] = []
let _did = 1

export const taskDependencyService = {
  getByTaskId: async (taskId: string): Promise<TaskDependenciesView> => {
    await delay()
    const blocksDeps = _deps.filter((d) => d.fromTaskId === taskId && d.type === 'blocks')
    const blockedByDeps = _deps.filter((d) => d.fromTaskId === taskId && d.type === 'blocked_by')
    const blocks = blocksDeps.map((d) => _tasks.find((t) => t.id === d.toTaskId)).filter(Boolean) as TaskItemDto[]
    const blockedBy = blockedByDeps.map((d) => _tasks.find((t) => t.id === d.toTaskId)).filter(Boolean) as TaskItemDto[]
    return { blocks, blockedBy }
  },

  add: async (fromTaskId: string, toTaskId: string, type: DependencyType): Promise<_Dep> => {
    await delay()
    const exists = _deps.find((d) => d.fromTaskId === fromTaskId && d.toTaskId === toTaskId && d.type === type)
    if (exists) return exists
    const dep: _Dep = { id: `dep-${_did++}`, fromTaskId, toTaskId, type }
    _deps.push(dep)
    return dep
  },

  removeByTaskIds: async (fromTaskId: string, toTaskId: string, type: DependencyType): Promise<void> => {
    await delay()
    _deps = _deps.filter((d) => !(d.fromTaskId === fromTaskId && d.toTaskId === toTaskId && d.type === type))
  },
}

// ─── Custom property store ───────────────────────────────────────────────────

let _propDefs: CustomPropDef[] = []
let _propVals = new Map<string, CustomPropValue[]>()
let _cdid = 1

export const customPropertyService = {
  getDefs: async (): Promise<CustomPropDef[]> => {
    await delay()
    return [..._propDefs]
  },

  createDef: async (def: Omit<CustomPropDef, 'id'>): Promise<CustomPropDef> => {
    await delay()
    const d: CustomPropDef = { ...def, id: `cpd-${_cdid++}` }
    _propDefs.push(d)
    return d
  },

  deleteDef: async (id: string): Promise<void> => {
    await delay()
    _propDefs = _propDefs.filter((d) => d.id !== id)
    _propVals.forEach((vals, taskId) => {
      _propVals.set(taskId, vals.filter((v) => v.defId !== id))
    })
  },

  getValues: async (taskId: string): Promise<CustomPropValue[]> => {
    await delay()
    return [...(_propVals.get(taskId) ?? [])]
  },

  setValue: async (taskId: string, defId: string, value: string | number | boolean): Promise<void> => {
    await delay()
    const vals = [...(_propVals.get(taskId) ?? [])]
    const idx = vals.findIndex((v) => v.defId === defId)
    if (idx >= 0) vals[idx] = { defId, value }
    else vals.push({ defId, value })
    _propVals.set(taskId, vals)
  },
}

// ─── Activity log store ───────────────────────────────────────────────────────

const SEED_ACTIVITIES: ActivityEntry[] = [
  { id: 'act-1', taskId: 'task-1', action: 'created', userId: 'user-1', userName: 'Nguyễn Văn A', createdAtUtc: '2026-05-01T08:00:00Z' },
  { id: 'act-2', taskId: 'task-1', action: 'priority_changed', userId: 'user-1', userName: 'Nguyễn Văn A', createdAtUtc: '2026-05-01T09:30:00Z', meta: { from: 'Medium', to: 'High' } },
  { id: 'act-3', taskId: 'task-2', action: 'created', userId: 'user-2', userName: 'Trần Thị B', createdAtUtc: '2026-05-02T08:00:00Z' },
  { id: 'act-4', taskId: 'task-3', action: 'created', userId: 'user-1', userName: 'Nguyễn Văn A', createdAtUtc: '2026-05-03T08:00:00Z' },
  { id: 'act-5', taskId: 'task-3', action: 'status_changed', userId: 'user-2', userName: 'Trần Thị B', createdAtUtc: '2026-05-04T10:00:00Z', meta: { from: 'To Do', to: 'In Progress' } },
  { id: 'act-6', taskId: 'task-3', action: 'assignee_changed', userId: 'user-1', userName: 'Nguyễn Văn A', createdAtUtc: '2026-05-04T11:00:00Z', meta: { from: '', to: 'Nguyễn Văn A' } },
  { id: 'act-7', taskId: 'task-4', action: 'created', userId: 'user-3', userName: 'Lê Văn C', createdAtUtc: '2026-05-04T08:00:00Z' },
  { id: 'act-8', taskId: 'task-4', action: 'description_changed', userId: 'user-3', userName: 'Lê Văn C', createdAtUtc: '2026-05-04T14:00:00Z' },
]

let _activities: ActivityEntry[] = [...SEED_ACTIVITIES]
let _actId = SEED_ACTIVITIES.length + 1

export const taskActivityService = {
  getByTaskId: async (taskId: string): Promise<ActivityEntry[]> => {
    await delay()
    return _activities.filter((a) => a.taskId === taskId).sort((a, b) =>
      new Date(b.createdAtUtc).getTime() - new Date(a.createdAtUtc).getTime()
    )
  },

  add: async (taskId: string, action: ActivityAction, userId: string, userName: string, meta?: ActivityEntry['meta']): Promise<ActivityEntry> => {
    await delay()
    const entry: ActivityEntry = {
      id: `act-${_actId++}`,
      taskId,
      action,
      userId,
      userName,
      createdAtUtc: new Date().toISOString(),
      meta,
    }
    _activities.push(entry)
    return entry
  },
}

// ─── CSV import / export ─────────────────────────────────────────────────────

const CSV_HEADERS = ['code', 'title', 'status', 'priority', 'creator', 'startDate', 'dueDate', 'estimatedHours', 'description']

function csvEscape(val: string): string {
  return `"${val.replace(/"/g, '""')}"`
}

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let i = 0
  while (i < line.length) {
    if (line[i] === '"') {
      let val = ''
      i++
      while (i < line.length) {
        if (line[i] === '"' && line[i + 1] === '"') { val += '"'; i += 2 }
        else if (line[i] === '"') { i++; break }
        else { val += line[i++] }
      }
      result.push(val)
      if (line[i] === ',') i++
    } else {
      const end = line.indexOf(',', i)
      if (end === -1) { result.push(line.slice(i)); break }
      result.push(line.slice(i, end))
      i = end + 1
    }
  }
  return result
}

export function exportTasksToCSV(tasks: TaskItemDto[]): string {
  const rows = tasks.map((t) =>
    [
      t.code,
      t.title,
      t.statusName ?? '',
      t.priorityName ?? '',
      t.creatorName ?? '',
      t.startDate ?? '',
      t.dueDate ?? '',
      String(t.estimatedHours ?? ''),
      t.description ?? '',
    ].map(csvEscape).join(','),
  )
  return [CSV_HEADERS.join(','), ...rows].join('\n')
}

export async function importTasksFromCSV(csvText: string): Promise<TaskItemDto[]> {
  const lines = csvText.trim().split('\n')
  if (lines.length < 2) return []
  const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''))
  const results: TaskItemDto[] = []
  for (let i = 1; i < lines.length; i++) {
    const vals = parseCSVLine(lines[i])
    const row: Record<string, string> = {}
    headers.forEach((h, idx) => { row[h] = vals[idx] ?? '' })
    const status = _statuses.find((s) => s.name.toLowerCase() === (row.status ?? '').toLowerCase()) ?? _statuses[0]
    const priority = _priorities.find((p) => p.name.toLowerCase() === (row.priority ?? '').toLowerCase()) ?? _priorities[0]
    const task = await taskItemService.create({
      code: row.code || `TASK-${_tid}`,
      title: row.title || '(Untitled)',
      description: row.description || undefined,
      statusId: status.id,
      priorityId: priority.id,
      startDate: row.startDate || undefined,
      dueDate: row.dueDate || undefined,
      estimatedHours: row.estimatedHours ? Number(row.estimatedHours) : undefined,
    })
    results.push(task)
  }
  return results
}
