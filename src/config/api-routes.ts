const API_ROUTES = {
  AUTH: {
    LOGIN:        '/api/auth/login',
    REFRESH:      '/api/auth/refresh',
    LOGOUT:       '/api/auth/logout',
    ME:           '/api/auth/me',
    ME_DETAIL:    '/api/auth/me/detail',   // hồ sơ đầy đủ của nhân viên đang đăng nhập — không cần permission
    ME_SALARY:    '/api/auth/me/salary',   // lương hiện tại của nhân viên đang đăng nhập — không cần permission
    ME_PROFILE:   '/api/auth/me/profile',  // nhân viên tự cập nhật cá nhân/giấy tờ/tài chính
    PERMISSIONS:  '/api/auth/me/permissions',
    CHANGE_PASSWORD: '/api/auth/change-password',
  },


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
  EMPLOYEE_DOCUMENTS: {
    LIST:             (userId: string) => `/api/users/${userId}/documents`,
    UPLOAD:           (userId: string) => `/api/users/${userId}/documents`,
    DELETE:           (userId: string, documentId: string) => `/api/users/${userId}/documents/${documentId}`,
    TOGGLE_VISIBILITY: (userId: string, documentId: string) => `/api/users/${userId}/documents/${documentId}/visibility`,
  },

  MY_DOCUMENTS: {
    LIST:   '/api/me/documents',
    UPLOAD: '/api/me/documents',
    DELETE: (documentId: string) => `/api/me/documents/${documentId}`,
  },

  SALARY: {
    CURRENT:  (userId: string) => `/api/hrm/users/${userId}/salary/current`,
    HISTORY:  (userId: string) => `/api/hrm/users/${userId}/salary/history`,
    SET:      (userId: string) => `/api/hrm/users/${userId}/salary`,
  },

  KPI_ENTRIES: {
    LIST:    '/api/hrm/kpi-entries',
    SUMMARY: '/api/hrm/kpi-entries/summary',
    UPSERT:  '/api/hrm/kpi-entries',
  },

  PAYROLL_RUNS: {
    LIST:          '/api/hrm/payroll-runs',
    GET_BY_ID:     (id: string) => `/api/hrm/payroll-runs/${id}`,
    CREATE:        '/api/hrm/payroll-runs',
    UPDATE_ENTRY:  (entryId: string) => `/api/hrm/payroll-runs/entries/${entryId}`,
    FINALIZE:      (id: string) => `/api/hrm/payroll-runs/${id}/finalize`,
  },
} as const

export { API_ROUTES }
