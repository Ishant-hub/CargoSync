import { Request, Response, NextFunction } from 'express';
import { Permission, hasPermission } from '../utils/permissions';

export const requireRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required.',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: `Forbidden. Action requires one of the following roles: ${allowedRoles.join(', ')}`,
      });
      return;
    }

    next();
  };
};

export const requirePermission = (permission: Permission) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required.',
      });
      return;
    }

    const allowed = hasPermission(req.user.role, permission, req.user.companyRole);
    if (!allowed) {
      res.status(403).json({
        success: false,
        error: `Forbidden. Missing required permission: ${permission}`,
      });
      return;
    }

    next();
  };
};
