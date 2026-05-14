// TODO: Remove when BE API is ready — revert imports in:
//   TaskView.tsx, KanbanBoard.tsx, TaskCreateDialog.tsx, PriorityManagerDialog.tsx
import type { TaskStatusDto, TaskItemDto, CreateTaskRequest, UpdateTaskRequest, CreateTaskStatusRequest, UpdateTaskStatusRequest } from '../types/task.types'
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
  { id: 'task-5', code: 'TASK-005', title: 'Code review module Task Management', description: 'Review PR #42 — Kanban board implementation', statusId: 'status-3', statusName: 'In Review', priorityId: 'priority-2', priorityName: 'Medium', creatorId: 'user-2', creatorName: 'Trần Thị B', dueDate: '2026-05-15T00:00:00Z', isActive: true, createdAtUtc: '2026-05-05T00:00:00Z' },
  { id: 'task-6', code: 'TASK-006', title: 'Viết unit test cho auth service', description: 'Coverage tối thiểu 80% cho authentication module', statusId: 'status-3', statusName: 'In Review', priorityId: 'priority-1', priorityName: 'Low', creatorId: 'user-1', creatorName: 'Nguyễn Văn A', dueDate: '2026-05-16T00:00:00Z', isActive: true, createdAtUtc: '2026-05-06T00:00:00Z' },
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
      priorityId: data.priorityId,
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
