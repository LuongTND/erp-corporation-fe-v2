/**
 * Permission codes — mirrors [HasPermission] attributes in BE controllers.
 * Keep in sync with BE when new endpoints are added.
 */
export const P = {
  // Roles
  ROLES_VIEW: 'rbac:roles:view-list',
  ROLES_VIEW_USERS: 'rbac:roles:view-users',
  ROLES_CREATE: 'rbac:roles:create',
  ROLES_UPDATE: 'rbac:roles:update',
  ROLES_DELETE: 'rbac:roles:delete',
  ROLES_ASSIGN_PERMISSION: 'rbac:roles:assign-permission',
  ROLES_SYNC_USERS: 'rbac:roles:sync-users',

  // Audit Logs
  AUDIT_LOGS_VIEW: 'rbac:audit-logs:view-list',

  // Permissions
  PERMISSIONS_VIEW: 'rbac:permissions:view-list',
  PERMISSIONS_DELETE: 'rbac:permissions:delete',

  // Users
  USERS_VIEW: 'hrm:users:view',
  USERS_VIEW_HISTORY: 'hrm:users:view-history',
  USERS_EXPORT: 'hrm:users:export',
  USERS_CREATE: 'hrm:users:create',
  USERS_UPDATE_PROFILE: 'hrm:users:update-profile',
  USERS_UPDATE_STATUS: 'hrm:users:update-status',
  USERS_LOCK: 'hrm:users:lock',
  USERS_ASSIGN_ROLE: 'hrm:users:assign-role',
  USERS_REVOKE_ROLE: 'hrm:users:revoke-role',
  USERS_SET_SCOPE: 'hrm:users:set-scope',
  USERS_ADD_DEPARTMENT: 'hrm:users:add-department',
  USERS_UPDATE_DEPARTMENT: 'hrm:users:update-department',
  USERS_REMOVE_DEPARTMENT: 'hrm:users:remove-department',
  USERS_TRANSFER_DEPARTMENT: 'hrm:users:transfer-department',
  USERS_ASSIGN_EMPLOYEE_TYPE: 'hrm:users:assign-employee-type',
  USERS_REMOVE_JOB_LEVEL: 'hrm:users:remove-job-level',
  USERS_UPDATE_CUSTOM_FIELDS: 'hrm:users:update-custom-fields',

  // Documents
  DOCUMENTS_VIEW: 'hrm:documents:view',
  DOCUMENTS_UPLOAD: 'hrm:documents:upload',
  DOCUMENTS_DELETE: 'hrm:documents:delete',

  // Labels
  LABELS_VIEW: 'hrm:labels:view',
  LABELS_MANAGE: 'hrm:labels:manage',
  LABELS_ASSIGN: 'hrm:labels:assign',

  // Departments
  DEPARTMENTS_VIEW: 'hrm:departments:view-list',
  DEPARTMENTS_VIEW_DETAIL: 'hrm:departments:view-detail',
  DEPARTMENTS_VIEW_TREE: 'hrm:departments:view-tree',
  DEPARTMENTS_VIEW_MEMBERS: 'hrm:departments:view-members',
  DEPARTMENTS_CREATE: 'hrm:departments:create',
  DEPARTMENTS_UPDATE: 'hrm:departments:update',
  DEPARTMENTS_DELETE: 'hrm:departments:delete',

  // Stores
  STORES_VIEW: 'hrm:stores:view-list',
  STORES_VIEW_HOURS: 'hrm:stores:view-hours',
  STORES_SYNC: 'hrm:stores:sync',
  STORES_TOGGLE_ACTIVE: 'hrm:stores:toggle-active',
  STORES_UPDATE_HOURS: 'hrm:stores:update-hours',
  STORES_ASSIGN_MANAGER: 'hrm:stores:assign-manager',
  STORES_VIEW_MEMBERS: 'hrm:stores:view-members',
  STORES_ADD_MEMBER: 'hrm:stores:add-member',
  STORES_REMOVE_MEMBER: 'hrm:stores:remove-member',
  STORES_DELETE: 'hrm:stores:delete',
  STORES_IMPORT_FROM_POS: 'hrm:stores:import-from-pos',

  // Store Manager (portal)
  STORE_MANAGER_VIEW: 'hrm:store-manager:view-store',
  STORE_MANAGER_VIEW_MEMBERS: 'hrm:store-manager:view-members',

  // Regions
  REGIONS_VIEW: 'hrm:regions:view-list',
  REGIONS_SYNC: 'hrm:regions:sync',
  REGIONS_VIEW_HOURS: 'hrm:regions:view-hours',
  REGIONS_UPDATE_HOURS: 'hrm:regions:update-hours',
  REGIONS_ASSIGN_MANAGER: 'hrm:regions:assign-manager',

  // Counters
  COUNTERS_VIEW: 'hrm:counters:view-list',
  COUNTERS_CREATE: 'hrm:counters:create',
  COUNTERS_UPDATE: 'hrm:counters:update',
  COUNTERS_DELETE: 'hrm:counters:delete',

  // Job Levels
  JOB_LEVELS_VIEW: 'hrm:job-levels:view-list',
  JOB_LEVELS_VIEW_DETAIL: 'hrm:job-levels:view-detail',
  JOB_LEVELS_CREATE: 'hrm:job-levels:create',
  JOB_LEVELS_UPDATE: 'hrm:job-levels:update',
  JOB_LEVELS_DELETE: 'hrm:job-levels:delete',

  // Department Job Levels
  DEPT_JOB_LEVELS_VIEW: 'hrm:department-job-levels:view-list',
  DEPT_JOB_LEVELS_VIEW_DETAIL: 'hrm:department-job-levels:view-detail',
  DEPT_JOB_LEVELS_CREATE: 'hrm:department-job-levels:create',
  DEPT_JOB_LEVELS_UPDATE: 'hrm:department-job-levels:update',
  DEPT_JOB_LEVELS_DELETE: 'hrm:department-job-levels:delete',
  DEPT_JOB_LEVELS_ASSIGN_KPI_TEMPLATE: 'hrm:department-job-levels:assign-kpi-template',

  // Employee Types
  EMPLOYEE_TYPES_VIEW: 'hrm:employee-types:view-list',
  EMPLOYEE_TYPES_CREATE: 'hrm:employee-types:create',
  EMPLOYEE_TYPES_UPDATE: 'hrm:employee-types:update',
  EMPLOYEE_TYPES_DELETE: 'hrm:employee-types:delete',

  // Custom Fields
  CUSTOM_FIELDS_READ: 'hrm:custom-fields:view-list',
  CUSTOM_FIELDS_VIEW_DETAIL: 'hrm:custom-fields:view-detail',
  CUSTOM_FIELDS_CREATE: 'hrm:custom-fields:create',
  CUSTOM_FIELDS_UPDATE: 'hrm:custom-fields:update',
  CUSTOM_FIELDS_DELETE: 'hrm:custom-fields:delete',

  // Salary
  SALARY_VIEW: 'hrm:salary:view',
  SALARY_SET: 'hrm:salary:set',

  // Payroll Runs
  PAYROLL_RUNS_VIEW: 'hrm:payroll-runs:view-list',
  PAYROLL_RUNS_VIEW_DETAIL: 'hrm:payroll-runs:view-detail',
  PAYROLL_RUNS_CREATE: 'hrm:payroll-runs:create',
  PAYROLL_RUNS_UPDATE_ENTRY: 'hrm:payroll-runs:update-entry',
  PAYROLL_RUNS_FINALIZE: 'hrm:payroll-runs:finalize',

  // Bonus Policies
  BONUS_POLICIES_VIEW: 'hrm:bonus-policies:view-list',
  BONUS_POLICIES_CREATE: 'hrm:bonus-policies:create',

  // KPI Templates
  KPI_TEMPLATES_VIEW: 'hrm:kpi-templates:view-list',
  KPI_TEMPLATES_VIEW_DETAIL: 'hrm:kpi-templates:view-detail',
  KPI_TEMPLATES_CREATE: 'hrm:kpi-templates:create',
  KPI_TEMPLATES_UPDATE: 'hrm:kpi-templates:update',
  KPI_TEMPLATES_DELETE: 'hrm:kpi-templates:delete',

  // KPI Entries
  KPI_ENTRIES_VIEW: 'hrm:kpi-entries:view-list',
  KPI_ENTRIES_VIEW_SUMMARY: 'hrm:kpi-entries:view-summary',
  KPI_ENTRIES_UPSERT: 'hrm:kpi-entries:upsert',

  // Contracts
  CONTRACT_VIEW: 'hrm:contract:view',
  CONTRACT_CREATE: 'hrm:contract:create',
  CONTRACT_RENEW: 'hrm:contract:renew',
  CONTRACT_TERMINATE: 'hrm:contract:terminate',
  CONTRACT_GENERATE_FILE: 'hrm:contract:generate-file',
  CONTRACT_UPLOAD_SCAN: 'hrm:contract:upload-scan',

  // Recruitment Approver Config
  RECRUITMENT_APPROVER_VIEW: 'hrm:recruitment:approver-config:view',
  RECRUITMENT_APPROVER_MANAGE: 'hrm:recruitment:approver-config:manage',

  // Recruitment Requests
  RECRUITMENT_REQUEST_VIEW: 'hrm:recruitment:request:view',
  RECRUITMENT_REQUEST_CREATE: 'hrm:recruitment:request:create',
  RECRUITMENT_REQUEST_UPDATE: 'hrm:recruitment:request:update',
  RECRUITMENT_REQUEST_SUBMIT: 'hrm:recruitment:request:submit',
  RECRUITMENT_REQUEST_APPROVE: 'hrm:recruitment:request:approve',
  RECRUITMENT_REQUEST_APPROVE_LEVEL1: 'hrm:recruitment:request:approve-level1',
  RECRUITMENT_REQUEST_REJECT: 'hrm:recruitment:request:reject',
  RECRUITMENT_REQUEST_MORE_INFO: 'hrm:recruitment:request:more-info',
  RECRUITMENT_REQUEST_HISTORY: 'hrm:recruitment:request:history',

  // Job Postings
  RECRUITMENT_POSTING_MANAGE: 'hrm:recruitment:posting:manage',
  RECRUITMENT_POSTING_PAID_CREATE: 'hrm:recruitment:posting:paid-create',
  RECRUITMENT_POSTING_PAID_APPROVE: 'hrm:recruitment:posting:paid-approve',

  // Candidates
  RECRUITMENT_CANDIDATE_VIEW: 'hrm:recruitment:candidate:view',
  RECRUITMENT_CANDIDATE_CREATE: 'hrm:recruitment:candidate:create',
  RECRUITMENT_CANDIDATE_UPDATE: 'hrm:recruitment:candidate:update',
  RECRUITMENT_CANDIDATE_UPLOAD_CV: 'hrm:recruitment:candidate:upload-cv',
  RECRUITMENT_CANDIDATE_SCREEN: 'hrm:recruitment:candidate:screen',
  RECRUITMENT_CANDIDATE_ASSIGN: 'hrm:recruitment:candidate:assign',
  RECRUITMENT_CANDIDATE_EVALUATE: 'hrm:recruitment:candidate:evaluate',
  RECRUITMENT_CANDIDATE_REJECT: 'hrm:recruitment:candidate:reject',
  RECRUITMENT_CANDIDATE_HIRE: 'hrm:recruitment:candidate:hire',

  // Interview Rule Configs
  INTERVIEW_RULE_CONFIGS_MANAGE: 'hrm:recruitment:interview-rule:manage',

  // Interview Schedules
  INTERVIEW_SCHEDULE_MANAGE: 'hrm:recruitment:interview-schedule:manage',
  INTERVIEW_SCHEDULE_COMPLETE: 'hrm:recruitment:interview-schedule:complete',

  // Contract Templates
  CONTRACT_TEMPLATES_VIEW: 'hrm:contract-templates:view',
  CONTRACT_TEMPLATES_UPLOAD: 'hrm:contract-templates:upload',
  CONTRACT_TEMPLATES_DOWNLOAD: 'hrm:contract-templates:download',
  CONTRACT_TEMPLATES_UPDATE_SCHEMA: 'hrm:contract-templates:update-schema',
  CONTRACT_TEMPLATES_DELETE: 'hrm:contract-templates:delete',
} as const

export type PermissionCode = (typeof P)[keyof typeof P]
