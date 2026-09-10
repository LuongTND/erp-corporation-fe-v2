const API_ROUTES = {
  // ── Auth ──────────────────────────────────────────────────────────────────
  AUTH: {
    LOGIN:           '/api/auth/login',
    REFRESH:         '/api/auth/refresh',
    LOGOUT:          '/api/auth/logout',
    ME:              '/api/auth/me',
    ME_DETAIL:       '/api/auth/me/detail',
    ME_SALARY:       '/api/auth/me/salary',
    ME_PROFILE:      '/api/auth/me/profile',
    PERMISSIONS:     '/api/auth/me/permissions',
    CHANGE_PASSWORD: '/api/auth/change-password',
  },

  // ── Users ─────────────────────────────────────────────────────────────────
  USERS: {
    BASE:            '/api/users',
    GET_BY_ID:       (id: string) => `/api/users/${id}`,
    EXPORT:          '/api/users/export',
    STATUS:          (id: string) => `/api/users/${id}/status`,
    STATUS_HISTORY:  (id: string) => `/api/users/${id}/status-history`,
    LOCK:            (id: string) => `/api/users/${id}/lock`,
    CUSTOM_FIELDS:   (id: string) => `/api/users/${id}/custom-fields`,
    WORK_HISTORY:    (id: string) => `/api/users/${id}/work-history`,
    AVATAR:          (id: string) => `/api/users/${id}/avatar`,
    ROLES:           (id: string) => `/api/users/${id}/roles`,
    ROLE:            (id: string, roleId: string) => `/api/users/${id}/roles/${roleId}`,
    DEPARTMENTS:     (id: string) => `/api/users/${id}/departments`,
    DEPARTMENT:      (id: string, departmentId: string) => `/api/users/${id}/departments/${departmentId}`,
    LABELS:          (id: string, labelId: string) => `/api/users/${id}/labels/${labelId}`,
    EMPLOYEE_TYPE:   (id: string) => `/api/users/${id}/employee-type`,
    JOB_LEVEL:       (id: string) => `/api/users/${id}/job-level`,
  },

  // ── Employee Documents ────────────────────────────────────────────────────
  EMPLOYEE_DOCUMENTS: {
    LIST:              (userId: string) => `/api/users/${userId}/documents`,
    UPLOAD:            (userId: string) => `/api/users/${userId}/documents`,
    DELETE:            (userId: string, documentId: string) => `/api/users/${userId}/documents/${documentId}`,
    TOGGLE_VISIBILITY: (userId: string, documentId: string) => `/api/users/${userId}/documents/${documentId}/visibility`,
  },

  MY_DOCUMENTS: {
    LIST:   '/api/me/documents',
    UPLOAD: '/api/me/documents',
    DELETE: (documentId: string) => `/api/me/documents/${documentId}`,
  },

  // ── Roles ─────────────────────────────────────────────────────────────────
  ROLES: {
    BASE:        '/api/roles',
    GET_BY_ID:   (id: string) => `/api/roles/${id}`,
    PERMISSIONS: (id: string) => `/api/roles/${id}/permissions`,
    USERS:       (id: string) => `/api/roles/${id}/users`,
  },

  // ── Permissions ───────────────────────────────────────────────────────────
  PERMISSIONS: {
    BASE:      '/api/permissions',
    GET_BY_ID: (id: string) => `/api/permissions/${id}`,
  },

  // ── Audit Logs ────────────────────────────────────────────────────────────
  AUDIT_LOGS: {
    BASE: '/api/audit-logs',
  },

  // ── Departments ───────────────────────────────────────────────────────────
  DEPARTMENTS: {
    BASE:         '/api/departments',
    GET_BY_ID:    (id: string) => `/api/departments/${id}`,
    TREE:         '/api/departments/tree',
    MEMBERS:      (id: string) => `/api/departments/${id}/members`,
    MEMBERS_BULK: (id: string) => `/api/departments/${id}/members/bulk`,
  },

  // ── Job Levels ────────────────────────────────────────────────────────────
  JOB_LEVELS: {
    BASE:      '/api/job-levels',
    GET_BY_ID: (id: string) => `/api/job-levels/${id}`,
  },

  // ── Employee Types ────────────────────────────────────────────────────────
  EMPLOYEE_TYPES: {
    BASE:      '/api/employee-types',
    GET_BY_ID: (id: string) => `/api/employee-types/${id}`,
  },

  // ── Labels ────────────────────────────────────────────────────────────────
  LABELS: {
    BASE:      '/api/labels',
    GET_BY_ID: (id: string) => `/api/labels/${id}`,
  },

  // ── Custom Field Definitions ──────────────────────────────────────────────
  CUSTOM_FIELDS: {
    BASE:      '/api/custom-field-definitions',
    GET_BY_ID: (id: string) => `/api/custom-field-definitions/${id}`,
  },

  // ── Counters ──────────────────────────────────────────────────────────────
  COUNTERS: {
    BASE:          '/api/counters',
    GET_BY_ID:     (id: string) => `/api/counters/${id}`,
    TOGGLE_ACTIVE: (id: string) => `/api/counters/${id}/toggle-active`,
  },

  // ── Stores ────────────────────────────────────────────────────────────────
  STORES: {
    BASE:          '/api/stores',
    GET_BY_ID:     (id: string) => `/api/stores/${id}`,
    SYNC:          '/api/stores/sync',
    HOURS:         (id: string) => `/api/stores/${id}/store-hours`,
    TOGGLE_ACTIVE: (id: string) => `/api/stores/${id}/toggle-active`,
    MANAGER:       (id: string) => `/api/stores/${id}/manager`,
    MEMBERS:       (id: string) => `/api/stores/${id}/members`,
    MEMBER:        (id: string, userId: string) => `/api/stores/${id}/members/${userId}`,
  },

  STORE_MANAGER: {
    MY_STORE:         '/api/store-manager/my-store',
    MY_STORE_MEMBERS: '/api/store-manager/my-store/members',
  },

  // ── Regions ───────────────────────────────────────────────────────────────
  REGIONS: {
    BASE:      '/api/regions',
    GET_BY_ID: (id: string) => `/api/regions/${id}`,
    SYNC:      '/api/regions/sync',
    HOURS:     (id: string) => `/api/regions/${id}/region-hours`,
    MANAGER:   (id: string) => `/api/regions/${id}/manager`,
  },

  // ── POS ───────────────────────────────────────────────────────────────────
  POS: {
    STORES: '/api/pos/stores',
  },

  // ── HRM: Salary ───────────────────────────────────────────────────────────
  SALARY: {
    CURRENT: (userId: string) => `/api/hrm/users/${userId}/salary/current`,
    HISTORY: (userId: string) => `/api/hrm/users/${userId}/salary/history`,
    SET:     (userId: string) => `/api/hrm/users/${userId}/salary`,
  },

  // ── HRM: Contracts ────────────────────────────────────────────────────────
  CONTRACTS: {
    LIST:              (userId: string) => `/api/hrm/users/${userId}/contracts`,
    CREATE:            (userId: string) => `/api/hrm/users/${userId}/contracts`,
    RENEW:             (userId: string, contractId: string) => `/api/hrm/users/${userId}/contracts/${contractId}/renew`,
    TERMINATE:         (userId: string, contractId: string) => `/api/hrm/users/${userId}/contracts/${contractId}/terminate`,
    GENERATE:          (userId: string, contractId: string) => `/api/hrm/users/${userId}/contracts/${contractId}/generate`,
    SALARY_COMPARISON: (userId: string) => `/api/hrm/users/${userId}/contracts/salary-comparison`,
    EXPIRING:          '/api/hrm/contracts/expiring',
  },

  CONTRACT_TEMPLATES: {
    BASE:      '/api/hrm/contract-templates',
    GET_BY_ID: (id: string) => `/api/hrm/contract-templates/${id}`,
    DOWNLOAD:  (id: string) => `/api/hrm/contract-templates/${id}/download`,
  },

  // ── HRM: Department Job Levels ────────────────────────────────────────────
  DEPARTMENT_JOB_LEVELS: {
    BASE:      '/api/hrm/department-job-levels',
    GET_BY_ID: (id: string) => `/api/hrm/department-job-levels/${id}`,
  },

  // ── HRM: KPI / Payroll ────────────────────────────────────────────────────
  KPI_ENTRIES: {
    LIST:    '/api/hrm/kpi-entries',
    SUMMARY: '/api/hrm/kpi-entries/summary',
    UPSERT:  '/api/hrm/kpi-entries',
  },

  PAYROLL_RUNS: {
    LIST:         '/api/hrm/payroll-runs',
    GET_BY_ID:    (id: string) => `/api/hrm/payroll-runs/${id}`,
    CREATE:       '/api/hrm/payroll-runs',
    UPDATE_ENTRY: (entryId: string) => `/api/hrm/payroll-runs/entries/${entryId}`,
    FINALIZE:     (id: string) => `/api/hrm/payroll-runs/${id}/finalize`,
  },

  // ── Interview Rule Configs ────────────────────────────────────────────────
  INTERVIEW_RULE_CONFIGS: {
    BASE:      '/api/interview-rule-configs',
    GET_BY_ID: (id: string) => `/api/interview-rule-configs/${id}`,
    RESOLVE:   '/api/interview-rule-configs/resolve',
  },

  // ── Recruitment ───────────────────────────────────────────────────────────
  RECRUITMENT_REQUESTS: {
    BASE:              '/api/recruitment-requests',
    GET_BY_ID:         (id: string) => `/api/recruitment-requests/${id}`,
    SUBMIT:            (id: string) => `/api/recruitment-requests/${id}/submit`,
    APPROVE:           (id: string) => `/api/recruitment-requests/${id}/approve`,
    APPROVE_LEVEL1:    (id: string) => `/api/recruitment-requests/${id}/approve-level1`,
    REJECT:            (id: string) => `/api/recruitment-requests/${id}/reject`,
    REQUEST_MORE_INFO: (id: string) => `/api/recruitment-requests/${id}/request-more-info`,
  },

  RECRUITMENT_APPROVER_CONFIGS: {
    BASE:      '/api/recruitment/approver-configs',
    GET_BY_ID: (id: string) => `/api/recruitment/approver-configs/${id}`,
  },

  CANDIDATES: {
    BASE:               '/api/candidates',
    GET_BY_ID:          (id: string) => `/api/candidates/${id}`,
    CV:                 (id: string) => `/api/candidates/${id}/cv`,
    SCREEN:             (id: string) => `/api/candidates/${id}/screen`,
    ASSIGN_STORE:       (id: string) => `/api/candidates/${id}/assign-store`,
    ASSIGN_PRODUCTION:  (id: string) => `/api/candidates/${id}/assign-production`,
    EVALUATE:           (id: string) => `/api/candidates/${id}/evaluate`,
    REJECT:             (id: string) => `/api/candidates/${id}/reject`,
    HIRE:               (id: string) => `/api/candidates/${id}/hire`,
    INTERVIEWS:         (id: string) => `/api/candidates/${id}/interviews`,
    INTERVIEW_COMPLETE: (id: string, scheduleId: string) => `/api/candidates/${id}/interviews/${scheduleId}/complete`,
    INTERVIEW_CANCEL:   (id: string, scheduleId: string) => `/api/candidates/${id}/interviews/${scheduleId}/cancel`,
  },

  JOB_POSTINGS: {
    BASE:         '/api/job-postings',
    GET_BY_ID:    (id: string) => `/api/job-postings/${id}`,
    APPROVE_COST: (id: string) => `/api/job-postings/${id}/approve-cost`,
    REJECT_COST:  (id: string) => `/api/job-postings/${id}/reject-cost`,
  },

  // ── Workflow ──────────────────────────────────────────────────────────────
  WORKFLOW: {
    MY_TASKS:       '/api/workflow/my-tasks',
    INSTANCE_TASKS: (instanceId: string) => `/api/workflow/instances/${instanceId}/tasks`,
    TEMPLATES:      '/api/workflow/templates',
    TEMPLATE:       (templateId: string) => `/api/workflow/templates/${templateId}`,
    STEPS:          (templateId: string) => `/api/workflow/templates/${templateId}/steps`,
    STEP:           (templateId: string, stepId: string) => `/api/workflow/templates/${templateId}/steps/${stepId}`,
    ENTITY_TYPES:   '/api/workflow/entity-types',
    SCOPE_TYPES:    '/api/workflow/scope-types',
    APPROVER_TYPES: '/api/workflow/approver-types',
    APPROVE:        (instanceId: string) => `/api/workflow/instances/${instanceId}/approve`,
    REJECT:         (instanceId: string) => `/api/workflow/instances/${instanceId}/reject`,
    CANCEL:         (instanceId: string) => `/api/workflow/instances/${instanceId}/cancel`,
  },

  // ── Tasks ─────────────────────────────────────────────────────────────────
  TASK_PRIORITIES: {
    BASE:                 '/api/task-priorities',
    GET_ALL:              '/api/task-priorities',
    GET_BY_ID:            (id: string) => `/api/task-priorities/${id}`,
    GET_BY_CODE:          (code: string) => `/api/task-priorities/code/${code}`,
    CREATE:               '/api/task-priorities',
    UPDATE:               (id: string) => `/api/task-priorities/${id}`,
    TOGGLE_ACTIVE:        (id: string) => `/api/task-priorities/${id}/toggle-active`,
    GET_ALL_FOR_DROPDOWN: '/api/task-priorities/all',
  },

  TASK_STATUSES: {
    BASE:                 '/api/task-statuses',
    GET_ALL:              '/api/task-statuses',
    GET_BY_ID:            (id: string) => `/api/task-statuses/${id}`,
    GET_BY_CODE:          (code: string) => `/api/task-statuses/code/${code}`,
    CREATE:               '/api/task-statuses',
    UPDATE:               (id: string) => `/api/task-statuses/${id}`,
    TOGGLE_ACTIVE:        (id: string) => `/api/task-statuses/${id}/toggle-active`,
    GET_ALL_FOR_DROPDOWN: '/api/task-statuses/all',
  },

  TASK_ITEMS: {
    BASE:              '/api/tasks',
    GET_ALL:           '/api/tasks',
    GET_BY_ID:         (id: string) => `/api/tasks/${id}`,
    GET_BY_CODE:       (code: string) => `/api/tasks/code/${code}`,
    CREATE:            '/api/tasks',
    UPDATE:            (id: string) => `/api/tasks/${id}`,
    TOGGLE_ACTIVE:     (id: string) => `/api/tasks/${id}/toggle-active`,
    UPDATE_STATUS:     (id: string) => `/api/tasks/${id}/status`,
    UPDATE_PRIORITY:   (id: string) => `/api/tasks/${id}/priority`,
    UPDATE_PROGRESS:   (id: string) => `/api/tasks/${id}/progress`,
    COMPLETE:          (id: string) => `/api/tasks/${id}/complete`,
    GET_MY_TASKS:      (employeeId: string) => `/api/tasks/my-tasks/${employeeId}`,
    GET_BY_PROJECT:    (projectId: string) => `/api/tasks/project/${projectId}`,
    GET_BY_DEPARTMENT: (departmentId: string) => `/api/tasks/department/${departmentId}`,
    GET_OVERDUE:       '/api/tasks/overdue',
    GET_UPCOMING:      '/api/tasks/upcoming',
    BULK_CREATE:       '/api/tasks/bulk',
    DUPLICATE:         (id: string) => `/api/tasks/${id}/duplicate`,
    ATTACHMENTS:       (id: string) => `/api/tasks/${id}/attachments`,
    ATTACHMENT:        (id: string, attachmentId: string) => `/api/tasks/${id}/attachments/${attachmentId}`,
    DEPENDENCIES:      (id: string) => `/api/tasks/${id}/dependencies`,
    DEPENDENCY:        (id: string, toTaskId: string) => `/api/tasks/${id}/dependencies/${toTaskId}`,
    ACTIVITIES:        (id: string) => `/api/tasks/${id}/activities`,
    CUSTOM_PROPS_DEFS: '/api/tasks/custom-properties',
    CUSTOM_PROP_DEF:   (id: string) => `/api/tasks/custom-properties/${id}`,
    CUSTOM_PROPS:      (taskId: string) => `/api/tasks/${taskId}/custom-properties`,
  },
} as const

export { API_ROUTES }
