import { Request, Response, NextFunction } from 'express';
import { forbidden } from '../utils/errors';

// Role permissions mapping
const ROLE_PERMISSIONS: Record<string, string[]> = {
  SUPER_ADMIN: ['*'],
  NDMA_ADMIN: ['manage_users', 'manage_organizations', 'manage_trainings', 'approve_training', 'reject_training', 'view_analytics', 'view_reports', 'generate_reports', 'view_audit', 'manage_integrations', 'manage_alerts', 'view_all_data'],
  SDMA: ['manage_trainings', 'submit_training', 'view_analytics', 'view_reports', 'generate_reports', 'manage_participants', 'manage_attendance', 'view_org_data'],
  ATI: ['manage_trainings', 'submit_training', 'view_analytics', 'view_reports', 'manage_participants', 'manage_attendance', 'view_org_data'],
  NGO: ['manage_trainings', 'submit_training', 'view_analytics', 'view_reports', 'manage_participants', 'manage_attendance', 'view_org_data'],
  TRAINER: ['view_trainings', 'manage_attendance', 'view_participants', 'submit_assessments', 'view_own_data'],
  REVIEWER: ['view_trainings', 'approve_training', 'reject_training', 'view_analytics', 'view_reports', 'view_all_data'],
  DATA_ENTRY_OPERATOR: ['manage_trainings', 'manage_participants', 'manage_attendance', 'submit_assessments', 'view_org_data'],
  NDMA_VIEWER: ['view_trainings', 'view_analytics', 'view_reports', 'view_all_data'],
};

/**
 * Middleware that restricts access to specific roles.
 * Must be used after authenticate middleware.
 */
export function requireRole(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(forbidden('Authentication required'));
    }
    if (!roles.includes(req.user.role)) {
      return next(forbidden(`Access denied. Required roles: ${roles.join(', ')}`));
    }
    next();
  };
}

/**
 * Middleware that checks if the user has a specific permission.
 * Must be used after authenticate middleware.
 */
export function requirePermission(...permissions: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(forbidden('Authentication required'));
    }

    const userPerms = ROLE_PERMISSIONS[req.user.role] || [];

    // Super admin has all permissions
    if (userPerms.includes('*')) {
      return next();
    }

    const hasAll = permissions.every(p => userPerms.includes(p));
    if (!hasAll) {
      return next(forbidden(`Insufficient permissions. Required: ${permissions.join(', ')}`));
    }
    next();
  };
}

/**
 * Check if a role has a specific permission (utility function).
 */
export function hasPermission(role: string, permission: string): boolean {
  const perms = ROLE_PERMISSIONS[role] || [];
  return perms.includes('*') || perms.includes(permission);
}
