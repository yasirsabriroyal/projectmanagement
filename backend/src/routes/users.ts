import { Router, Response, NextFunction } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma';
import { requireAuth, AuthRequest } from '../middleware/requireAuth';
import { requirePermission } from '../middleware/requirePermission';
import { auditLog } from '../middleware/auditLog';
import { idempotencyMiddleware } from '../middleware/idempotency';
import { NotFoundError, ConflictError } from '../lib/errors';

const router = Router();
router.use(requireAuth);

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  organizationId: z.string().uuid().optional(),
  roleNames: z.array(z.string()).optional(),
});

const updateUserSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  isActive: z.boolean().optional(),
});

router.get('/', requirePermission('users.read'), async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, firstName: true, lastName: true, organizationId: true, isActive: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(users);
  } catch (err) { next(err); }
});

router.post('/', requirePermission('users.write'), idempotencyMiddleware(), auditLog('user', 'create'), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const body = createUserSchema.parse(req.body);
    const existing = await prisma.user.findUnique({ where: { email: body.email } });
    if (existing) throw new ConflictError('Email already registered');

    const passwordHash = await bcrypt.hash(body.password, 10);
    const user = await prisma.user.create({
      data: { email: body.email, passwordHash, firstName: body.firstName, lastName: body.lastName, organizationId: body.organizationId },
      select: { id: true, email: true, firstName: true, lastName: true, organizationId: true, createdAt: true },
    });

    if (body.roleNames?.length) {
      const roles = await prisma.role.findMany({ where: { name: { in: body.roleNames } } });
      await prisma.userRole.createMany({
        data: roles.map((r) => ({ userId: user.id, roleId: r.id })),
        skipDuplicates: true,
      });
    }

    res.status(201).json(user);
  } catch (err) { next(err); }
});

router.get('/:id', requirePermission('users.read'), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: { id: true, email: true, firstName: true, lastName: true, organizationId: true, isActive: true, createdAt: true },
    });
    if (!user) throw new NotFoundError('User');
    res.json(user);
  } catch (err) { next(err); }
});

router.put('/:id', requirePermission('users.write'), auditLog('user', 'update'), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const body = updateUserSchema.parse(req.body);
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: body,
      select: { id: true, email: true, firstName: true, lastName: true, organizationId: true, isActive: true, updatedAt: true },
    });
    res.json(user);
  } catch (err) { next(err); }
});

router.delete('/:id', requirePermission('users.delete'), auditLog('user', 'delete'), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) { next(err); }
});

export default router;
