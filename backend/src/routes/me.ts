import { Router, Response, NextFunction } from 'express';
import { requireAuth, AuthRequest } from '../middleware/requireAuth';
import prisma from '../lib/prisma';
import { NotFoundError } from '../lib/errors';

const router = Router();

router.get('/', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.sub },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        organizationId: true,
        isActive: true,
        createdAt: true,
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: { include: { permission: true } },
              },
            },
          },
        },
      },
    });

    if (!user) throw new NotFoundError('User');

    res.json({
      ...user,
      roles: user.userRoles.map((ur) => ur.role.name),
      permissions: [...new Set(user.userRoles.flatMap((ur) => ur.role.rolePermissions.map((rp) => rp.permission.name)))],
    });
  } catch (err) {
    next(err);
  }
});

export default router;
