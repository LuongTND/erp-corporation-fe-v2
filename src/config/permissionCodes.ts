/**
 * Permission codes — mirrors [HasPermission] attributes in BE controllers.
 * Keep in sync with BE when new endpoints are added.
 */
export const P = {
  // Roles
  ROLES_VIEW: 'roles:view-list',
  ROLES_VIEW_USERS: 'roles:view-users',
  ROLES_CREATE: 'roles:create',
  ROLES_UPDATE: 'roles:update',
  ROLES_DELETE: 'roles:delete',
  ROLES_ASSIGN_PERMISSION: 'roles:assign-permission',
  ROLES_SYNC_USERS: 'roles:sync-users',

  // Audit Logs
  AUDIT_LOGS_VIEW: 'audit-logs:view-list',

  // Permissions
  PERMISSIONS_VIEW: 'permissions:view-list',
  PERMISSIONS_DELETE: 'permissions:delete',

  // Users
  USERS_VIEW: 'users:view-list',
  USERS_VIEW_HISTORY: 'users:view-history',
  USERS_EXPORT: 'users:export',
  USERS_CREATE: 'users:create',
  USERS_UPDATE_PROFILE: 'users:update-profile',
  USERS_UPDATE_STATUS: 'users:update-status',
  USERS_LOCK: 'users:lock',
  USERS_ASSIGN_ROLE: 'users:assign-role',
  USERS_REVOKE_ROLE: 'users:revoke-role',
  USERS_SET_SCOPE: 'users:set-scope',
  USERS_ADD_DEPARTMENT: 'users:add-department',
  USERS_UPDATE_DEPARTMENT: 'users:update-department',
  USERS_REMOVE_DEPARTMENT: 'users:remove-department',
  USERS_TRANSFER_DEPARTMENT: 'users:transfer-department',
  USERS_ASSIGN_EMPLOYEE_TYPE: 'users:assign-employee-type',
  USERS_UPDATE_CUSTOM_FIELDS: 'users:update-custom-fields',

  // Documents
  DOCUMENTS_VIEW: 'documents:view',
  DOCUMENTS_UPLOAD: 'documents:upload',
  DOCUMENTS_DELETE: 'documents:delete',

  // Departments
  DEPARTMENTS_VIEW: 'departments:view-list',
  DEPARTMENTS_VIEW_DETAIL: 'departments:view-detail',
  DEPARTMENTS_VIEW_TREE: 'departments:view-tree',
  DEPARTMENTS_VIEW_MEMBERS: 'departments:view-members',
  DEPARTMENTS_CREATE: 'departments:create',
  DEPARTMENTS_UPDATE: 'departments:update',
  DEPARTMENTS_DELETE: 'departments:delete',

  // Stores
  STORES_VIEW: 'stores:view-list',
  STORES_VIEW_HOURS: 'stores:view-hours',
  STORES_SYNC: 'stores:sync',
  STORES_TOGGLE_ACTIVE: 'stores:toggle-active',
  STORES_UPDATE_HOURS: 'stores:update-hours',
  STORES_ASSIGN_MANAGER: 'stores:assign-manager',
  STORES_VIEW_MEMBERS: 'stores:view-members',
  STORES_ADD_MEMBER: 'stores:add-member',
  STORES_REMOVE_MEMBER: 'stores:remove-member',
  STORES_DELETE: 'stores:delete',
  STORES_IMPORT_FROM_POS: 'stores:import-from-pos',

  // Store Manager (portal)
  STORE_MANAGER_VIEW: 'store-manager:view-store',
  STORE_MANAGER_VIEW_MEMBERS: 'store-manager:view-members',

  // Regions
  REGIONS_VIEW: 'regions:view-list',
  REGIONS_SYNC: 'regions:sync',
  REGIONS_VIEW_HOURS: 'regions:view-hours',
  REGIONS_UPDATE_HOURS: 'regions:update-hours',

  // Counters
  COUNTERS_VIEW: 'counters:view-list',
  COUNTERS_CREATE: 'counters:create',
  COUNTERS_UPDATE: 'counters:update',
  COUNTERS_DELETE: 'counters:delete',

  // Job Levels
  JOB_LEVELS_VIEW: 'job-levels:view-list',
  JOB_LEVELS_VIEW_DETAIL: 'job-levels:view-detail',
  JOB_LEVELS_CREATE: 'job-levels:create',
  JOB_LEVELS_UPDATE: 'job-levels:update',
  JOB_LEVELS_DELETE: 'job-levels:delete',

  // Department Job Levels
  DEPT_JOB_LEVELS_VIEW: 'department-job-levels:view-list',
  DEPT_JOB_LEVELS_VIEW_DETAIL: 'department-job-levels:view-detail',
  DEPT_JOB_LEVELS_CREATE: 'department-job-levels:create',
  DEPT_JOB_LEVELS_UPDATE: 'department-job-levels:update',
  DEPT_JOB_LEVELS_DELETE: 'department-job-levels:delete',
  DEPT_JOB_LEVELS_ASSIGN_KPI_TEMPLATE: 'department-job-levels:assign-kpi-template',

  // Employee Types
  EMPLOYEE_TYPES_VIEW: 'employee-types:view-list',
  EMPLOYEE_TYPES_CREATE: 'employee-types:create',
  EMPLOYEE_TYPES_UPDATE: 'employee-types:update',
  EMPLOYEE_TYPES_DELETE: 'employee-types:delete',

  // Custom Fields
  CUSTOM_FIELDS_READ: 'custom-fields:view-list',
  CUSTOM_FIELDS_VIEW_DETAIL: 'custom-fields:view-detail',
  CUSTOM_FIELDS_CREATE: 'custom-fields:create',
  CUSTOM_FIELDS_UPDATE: 'custom-fields:update',
  CUSTOM_FIELDS_DELETE: 'custom-fields:delete',

  // Salary
  SALARY_VIEW: 'salary:view',
  SALARY_SET: 'salary:set',

  // Payroll Runs
  PAYROLL_RUNS_VIEW: 'payroll-runs:view-list',
  PAYROLL_RUNS_VIEW_DETAIL: 'payroll-runs:view-detail',
  PAYROLL_RUNS_CREATE: 'payroll-runs:create',
  PAYROLL_RUNS_UPDATE_ENTRY: 'payroll-runs:update-entry',
  PAYROLL_RUNS_FINALIZE: 'payroll-runs:finalize',

  // Bonus Policies
  BONUS_POLICIES_VIEW: 'bonus-policies:view-list',
  BONUS_POLICIES_CREATE: 'bonus-policies:create',

  // KPI Templates
  KPI_TEMPLATES_VIEW: 'kpi-templates:view-list',
  KPI_TEMPLATES_VIEW_DETAIL: 'kpi-templates:view-detail',
  KPI_TEMPLATES_CREATE: 'kpi-templates:create',
  KPI_TEMPLATES_UPDATE: 'kpi-templates:update',
  KPI_TEMPLATES_DELETE: 'kpi-templates:delete',

  // KPI Entries
  KPI_ENTRIES_VIEW: 'kpi-entries:view-list',
  KPI_ENTRIES_VIEW_SUMMARY: 'kpi-entries:view-summary',
  KPI_ENTRIES_UPSERT: 'kpi-entries:upsert',
} as const

export type PermissionCode = (typeof P)[keyof typeof P]
