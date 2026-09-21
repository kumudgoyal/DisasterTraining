import type { Role } from '@disaster/types';

// Role permissions
export const ROLE_PERMISSIONS: Record<Role, string[]> = {
  SUPER_ADMIN: ['*'], // all permissions
  NDMA_ADMIN: ['manage_users', 'manage_organizations', 'manage_trainings', 'approve_training', 'reject_training', 'view_analytics', 'view_reports', 'generate_reports', 'view_audit', 'manage_integrations', 'manage_alerts', 'view_all_data'],
  SDMA: ['manage_trainings', 'submit_training', 'view_analytics', 'view_reports', 'generate_reports', 'manage_participants', 'manage_attendance', 'view_org_data'],
  ATI: ['manage_trainings', 'submit_training', 'view_analytics', 'view_reports', 'manage_participants', 'manage_attendance', 'view_org_data'],
  NGO: ['manage_trainings', 'submit_training', 'view_analytics', 'view_reports', 'manage_participants', 'manage_attendance', 'view_org_data'],
  TRAINER: ['view_trainings', 'manage_attendance', 'view_participants', 'submit_assessments', 'view_own_data'],
  REVIEWER: ['view_trainings', 'approve_training', 'reject_training', 'view_analytics', 'view_reports', 'view_all_data'],
  DATA_ENTRY_OPERATOR: ['manage_trainings', 'manage_participants', 'manage_attendance', 'submit_assessments', 'view_org_data'],
  NDMA_VIEWER: ['view_trainings', 'view_analytics', 'view_reports', 'view_all_data'],
};

export const ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: 'Super Administrator',
  NDMA_ADMIN: 'NDMA Administrator',
  SDMA: 'SDMA Administrator',
  ATI: 'ATI Administrator',
  NGO: 'NGO Administrator',
  TRAINER: 'Trainer',
  REVIEWER: 'Reviewer',
  DATA_ENTRY_OPERATOR: 'Data Entry Operator',
  NDMA_VIEWER: 'NDMA Viewer',
};

export const ROLE_HIERARCHY: Record<Role, number> = {
  SUPER_ADMIN: 0,
  NDMA_ADMIN: 1,
  REVIEWER: 2,
  SDMA: 3,
  ATI: 3,
  NGO: 3,
  TRAINER: 4,
  DATA_ENTRY_OPERATOR: 4,
  NDMA_VIEWER: 5,
};

// Valid training status transitions
export const TRAINING_STATUS_TRANSITIONS: Record<string, string[]> = {
  DRAFT: ['SUBMITTED', 'CANCELLED'],
  SUBMITTED: ['UNDER_REVIEW', 'REJECTED', 'DRAFT'],
  UNDER_REVIEW: ['APPROVED', 'REJECTED'],
  APPROVED: ['SCHEDULED', 'IN_PROGRESS', 'CANCELLED'],
  REJECTED: ['DRAFT'],
  SCHEDULED: ['IN_PROGRESS', 'CANCELLED'],
  IN_PROGRESS: ['COMPLETED', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: ['DRAFT'],
};

export const TRAINING_STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
  UNDER_REVIEW: 'Under Review',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  SCHEDULED: 'Scheduled',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

export const ADMIN_ROLES: Role[] = ['SUPER_ADMIN', 'NDMA_ADMIN'];
export const ORG_ADMIN_ROLES: Role[] = ['SDMA', 'ATI', 'NGO'];
export const REVIEWER_ROLES: Role[] = ['SUPER_ADMIN', 'NDMA_ADMIN', 'REVIEWER'];
export const DATA_ENTRY_ROLES: Role[] = ['SUPER_ADMIN', 'NDMA_ADMIN', 'SDMA', 'ATI', 'NGO', 'DATA_ENTRY_OPERATOR'];

export function hasPermission(role: Role, permission: string): boolean {
  const perms = ROLE_PERMISSIONS[role];
  if (!perms) return false;
  return perms.includes('*') || perms.includes(permission);
}

export function canTransition(fromStatus: string, toStatus: string): boolean {
  const allowed = TRAINING_STATUS_TRANSITIONS[fromStatus];
  return allowed ? allowed.includes(toStatus) : false;
}
