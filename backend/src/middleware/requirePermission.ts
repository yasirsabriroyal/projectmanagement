import { Response, NextFunction } from 'express';
import { AuthRequest } from './requireAuth';
import { ForbiddenError } from '../lib/errors';
import prisma from '../lib/prisma';

export function requirePermission(permissionName: string) {
  return async (req: AuthRequest, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.sub;
      if (!userId) {
        return next(new ForbiddenError());
      }

      const userRoles = await prisma.userRole.findMany({
        where: { userId },
        include: {
          role: {
            include: {
              rolePermissions: {
                include: { permission: true },
              },
            },
          },
        },
      });

      const hasPermission = userRoles.some((ur) =>
        ur.role.rolePermissions.some((rp) => rp.permission.name === permissionName)
      );

      if (!hasPermission) {
        return next(new ForbiddenError(`Missing permission: ${permissionName}`));
      }

      next();
    } catch (err) {
      next(err as Error);
    }
  };
}
