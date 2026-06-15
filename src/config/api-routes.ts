const API_ROUTES = {
  TASK_PRIORITIES: {
    BASE: '/api/task-priorities',
    GET_ALL: '/api/task-priorities',
    GET_BY_ID: (id: string) => `/api/task-priorities/${id}`,
    GET_BY_CODE: (code: string) => `/api/task-priorities/code/${code}`,
    CREATE: '/api/task-priorities',
    UPDATE: (id: string) => `/api/task-priorities/${id}`,
    TOGGLE_ACTIVE: (id: string) => `/api/task-priorities/${id}/toggle-active`,
    GET_ALL_FOR_DROPDOWN: '/api/task-priorities/all',
  },

  TASK_STATUSES: {
    BASE: '/api/task-statuses',
    GET_ALL: '/api/task-statuses',
    GET_BY_ID: (id: string) => `/api/task-statuses/${id}`,
    GET_BY_CODE: (code: string) => `/api/task-statuses/code/${code}`,
    CREATE: '/api/task-statuses',
    UPDATE: (id: string) => `/api/task-statuses/${id}`,
    TOGGLE_ACTIVE: (id: string) => `/api/task-statuses/${id}/toggle-active`,
    GET_ALL_FOR_DROPDOWN: '/api/task-statuses/all',
  },

  TASK_ITEMS: {
    BASE: '/api/tasks',
    GET_ALL: '/api/tasks',
    GET_BY_ID: (id: string) => `/api/tasks/${id}`,
    GET_BY_CODE: (code: string) => `/api/tasks/code/${code}`,
    CREATE: '/api/tasks',
    UPDATE: (id: string) => `/api/tasks/${id}`,
    TOGGLE_ACTIVE: (id: string) => `/api/tasks/${id}/toggle-active`,
    UPDATE_STATUS: (id: string) => `/api/tasks/${id}/status`,
    UPDATE_PRIORITY: (id: string) => `/api/tasks/${id}/priority`,
    UPDATE_PROGRESS: (id: string) => `/api/tasks/${id}/progress`,
    COMPLETE: (id: string) => `/api/tasks/${id}/complete`,
    GET_MY_TASKS: (employeeId: string) => `/api/tasks/my-tasks/${employeeId}`,
    GET_BY_PROJECT: (projectId: string) => `/api/tasks/project/${projectId}`,
    GET_BY_DEPARTMENT: (departmentId: string) => `/api/tasks/department/${departmentId}`,
    GET_OVERDUE: '/api/tasks/overdue',
    GET_UPCOMING: '/api/tasks/upcoming',
    BULK_CREATE: '/api/tasks/bulk',
    DUPLICATE: (id: string) => `/api/tasks/${id}/duplicate`,
  },
} as const

export { API_ROUTES }
