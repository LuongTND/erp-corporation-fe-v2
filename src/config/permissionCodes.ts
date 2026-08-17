/**
 * Permission codes — mirrors [HasPermission] attributes in BE controllers.
 * Keep in sync with BE when new endpoints are added.
 */
export const P = {
  // Roles
  ROLES_VIEW: 'roles:view',
  ROLES_CREATE: 'roles:create',
  ROLES_UPDATE: 'roles:update',
  ROLES_DELETE: 'roles:delete',
  ROLES_ASSIGN_PERMISSION: 'roles:assign-permission',

  // Users
  USERS_VIEW: 'users:view',
  USERS_EDIT: 'users:edit',
  USERS_ASSIGN_ROLE: 'users:assign-role',
  USERS_ASSIGN_DEPARTMENT: 'users:assign-department',
  USERS_TRANSFER_DEPARTMENT: 'users:transfer-department',
  USERS_SET_SCOPE: 'users:set-scope',

  // Departments
  DEPARTMENTS_VIEW: 'departments:view',
  DEPARTMENTS_CREATE: 'departments:create',
  DEPARTMENTS_UPDATE: 'departments:update',
  DEPARTMENTS_DELETE: 'departments:delete',
  DEPARTMENTS_MANAGE: 'departments:manage',

  // Stores
  STORES_VIEW: 'stores:view',
  STORES_UPDATE: 'stores:update',
  STORES_DELETE: 'stores:delete',

  // Store Manager (portal)
  STORE_MANAGER_VIEW: 'store-manager:view',

  // Regions
  REGIONS_VIEW: 'regions:view',
  REGIONS_UPDATE: 'regions:update',

  // Counters
  COUNTERS_VIEW: 'counters:view',
  COUNTERS_CREATE: 'counters:create',
  COUNTERS_UPDATE: 'counters:update',
  COUNTERS_DELETE: 'counters:delete',

  // Job Levels
  JOB_LEVELS_VIEW: 'job-levels:view',
  JOB_LEVELS_CREATE: 'job-levels:create',
  JOB_LEVELS_UPDATE: 'job-levels:update',
  JOB_LEVELS_DELETE: 'job-levels:delete',

  // Department Job Levels
  DEPT_JOB_LEVELS_VIEW: 'department-job-levels:view',
  DEPT_JOB_LEVELS_CREATE: 'department-job-levels:create',
  DEPT_JOB_LEVELS_UPDATE: 'department-job-levels:update',
  DEPT_JOB_LEVELS_DELETE: 'department-job-levels:delete',

  // Employee Types
  EMPLOYEE_TYPES_VIEW: 'employee-types:view',
  EMPLOYEE_TYPES_CREATE: 'employee-types:create',
  EMPLOYEE_TYPES_UPDATE: 'employee-types:update',
  EMPLOYEE_TYPES_DELETE: 'employee-types:delete',

  // Salary
  SALARY_VIEW: 'salary:view',
  SALARY_CREATE: 'salary:create',

  // Payroll Runs
  PAYROLL_RUNS_VIEW: 'payroll-runs:view',
  PAYROLL_RUNS_CREATE: 'payroll-runs:create',
  PAYROLL_RUNS_UPDATE: 'payroll-runs:update',
  PAYROLL_RUNS_FINALIZE: 'payroll-runs:finalize',

  // Bonus Policies
  BONUS_POLICIES_VIEW: 'bonus-policies:view',
  BONUS_POLICIES_CREATE: 'bonus-policies:create',

  // KPI Templates
  KPI_TEMPLATES_VIEW: 'kpi-templates:view',
  KPI_TEMPLATES_CREATE: 'kpi-templates:create',
  KPI_TEMPLATES_UPDATE: 'kpi-templates:update',
  KPI_TEMPLATES_DELETE: 'kpi-templates:delete',

  // KPI Entries
  KPI_ENTRIES_VIEW: 'kpi-entries:view',
  KPI_ENTRIES_CREATE: 'kpi-entries:create',

  // Custom Fields
  CUSTOM_FIELDS_READ: 'custom-fields:read',
  CUSTOM_FIELDS_CREATE: 'custom-fields:create',
  CUSTOM_FIELDS_UPDATE: 'custom-fields:update',
  CUSTOM_FIELDS_DELETE: 'custom-fields:delete',
} as const

export type PermissionCode = (typeof P)[keyof typeof P]
