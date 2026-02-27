import { Response, NextFunction } from 'express';
import { AuthRequest } from './requireAuth';
import prisma from '../lib/prisma';
import { logger } from '../lib/logger';

export function auditLog(resource: string, action: string) {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    const originalJson = res.json.bind(res);

    res.json = function (body: unknown) {
      if (res.statusCode < 400) {
        const resourceId =
          (req.params.id) ||
          (body && typeof body === 'object' && 'id' in body ? (body as { id: string }).id : undefined);

        prisma.auditLog
          .create({
            data: {
              userId: req.user?.sub,
              organizationId: req.user?.organizationId,
              action,
              resource,
              resourceId: resourceId as string | undefined,
              details: { method: req.method, path: req.path },
              ipAddress: req.ip,
            },
          })
          .catch((err) => logger.error('Failed to write audit log', { error: err }));
      }
      return originalJson(body);
    };

    next();
  };
}
